import { useEffect, useRef, useState } from 'react';
import {
  CheckCircle,
  CloudUpload,
  FileText,
  Folder,
  Trash2,
} from 'lucide-react';
import { useToast } from '@/app/ToastContext';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import {
  uploadDocument,
  type DocumentTypeApi,
} from '@/lib/api/documents';
import { resolveErrorMessage, UI_MESSAGES } from '@/lib/uiMessages';
import { cn } from '@/lib/utils';
import type { PatientRecord } from '@/types';

interface UploadReportsModalProps {
  open: boolean;
  onClose: () => void;
  patient?: PatientRecord | null;
}

interface StagedFile {
  id: string;
  file: File;
  documentType: DocumentTypeApi;
  status: 'pending' | 'uploading' | 'done' | 'error';
  progress: number;
  error?: string;
}

const DOCUMENT_SECTIONS: {
  label: string;
  type: DocumentTypeApi;
}[] = [
  { label: 'Past Medical Reports', type: 'PAST_MEDICAL_REPORT' },
  { label: 'Prescriptions', type: 'PRESCRIPTION' },
  { label: 'Lab Reports', type: 'LAB_REPORT' },
];

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function UploadReportsModal({
  open,
  onClose,
  patient,
}: UploadReportsModalProps) {
  const { showToast } = useToast();
  const inputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<StagedFile[]>([]);
  const [activeSection, setActiveSection] = useState(DOCUMENT_SECTIONS[0].label);
  const [submitting, setSubmitting] = useState(false);
  const [confirmUploadOpen, setConfirmUploadOpen] = useState(false);
  const [removeFileId, setRemoveFileId] = useState<string | null>(null);

  const activeDocumentType =
    DOCUMENT_SECTIONS.find((section) => section.label === activeSection)?.type ??
    'PAST_MEDICAL_REPORT';

  useEffect(() => {
    if (!open) {
      setFiles([]);
      setActiveSection(DOCUMENT_SECTIONS[0].label);
      setSubmitting(false);
    }
  }, [open]);

  const handleClose = () => {
    if (submitting) return;
    onClose();
  };

  const addFiles = (fileList: FileList | null) => {
    if (!fileList?.length) return;
    const staged = Array.from(fileList).map((file) => ({
      id: `${file.name}-${file.lastModified}-${Math.random()}`,
      file,
      documentType: activeDocumentType,
      status: 'pending' as const,
      progress: 0,
    }));
    setFiles((prev) => [...prev, ...staged]);
  };

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((file) => file.id !== id));
  };

  const handleConfirm = async () => {
    if (!patient?.detailId || !patient?.bookingId) {
      showToast({
        title: 'Error',
        message: UI_MESSAGES.error.bookingRequired,
      });
      return;
    }

    const pending = files.filter((file) => file.status === 'pending');
    if (pending.length === 0) {
      showToast({
        title: 'No files selected',
        message: 'Choose at least one document to upload.',
      });
      return;
    }

    setConfirmUploadOpen(false);
    setSubmitting(true);
    let successCount = 0;

    for (const staged of pending) {
      setFiles((prev) =>
        prev.map((file) =>
          file.id === staged.id
            ? { ...file, status: 'uploading', progress: 30 }
            : file,
        ),
      );

      try {
        await uploadDocument(
          patient.detailId,
          patient.bookingId,
          staged.documentType,
          staged.file,
        );
        successCount += 1;
        setFiles((prev) =>
          prev.map((file) =>
            file.id === staged.id
              ? { ...file, status: 'done', progress: 100 }
              : file,
          ),
        );
      } catch (err) {
        const message = resolveErrorMessage(err, UI_MESSAGES.error.uploadFailed);
        setFiles((prev) =>
          prev.map((file) =>
            file.id === staged.id
              ? { ...file, status: 'error', progress: 0, error: message }
              : file,
          ),
        );
      }
    }

    setSubmitting(false);

    if (successCount > 0) {
      showToast({
        title: 'Documents uploaded',
        message: UI_MESSAGES.success.uploaded,
      });
    }

    if (successCount === pending.length) {
      onClose();
    }
  };

  const sectionLabel = (type: DocumentTypeApi) =>
    DOCUMENT_SECTIONS.find((section) => section.type === type)?.label ?? type;

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Upload Reports"
      size="md"
      footer={
        <div className="flex w-full justify-end gap-3">
          <Button variant="outline" onClick={handleClose} disabled={submitting}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              const pending = files.filter((file) => file.status === 'pending');
              if (pending.length === 0) {
                showToast({
                  title: 'No files selected',
                  message: 'Choose at least one document to upload.',
                });
                return;
              }
              setConfirmUploadOpen(true);
            }}
            disabled={submitting}
          >
            {submitting ? 'Uploading…' : 'Upload'}
          </Button>
        </div>
      }
    >
      {patient && (
        <p className="mb-4 text-sm text-text-muted">
          Uploading for{' '}
          <span className="font-medium text-brown">{patient.name}</span> ({patient.id})
        </p>
      )}

      {(!patient?.detailId || !patient?.bookingId) && (
        <p className="mb-4 rounded-lg bg-danger/10 px-3 py-2 text-sm text-danger">
          Patient or booking ID is missing for this row. Document upload is unavailable.
        </p>
      )}

      <div className="mb-4 flex flex-wrap gap-4 text-xs font-medium uppercase tracking-wide">
        {DOCUMENT_SECTIONS.map((section) => (
          <button
            key={section.type}
            type="button"
            onClick={() => setActiveSection(section.label)}
            className={cn(
              activeSection === section.label
                ? 'text-gold'
                : 'text-text-muted hover:text-brown',
            )}
          >
            {section.label}
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={!patient?.detailId || !patient?.bookingId || submitting}
        className="mb-4 flex w-full flex-col items-center gap-2 rounded-xl border-2 border-dashed border-gold/40 bg-gold/5 py-8 text-center hover:bg-gold/10 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <CloudUpload className="h-8 w-8 text-brown" />
        <span className="text-sm font-medium text-brown">Tap to upload document</span>
        <span className="text-xs text-text-muted">
          Supported: .jpg, .jpeg, .png, .pdf
        </span>
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/jpg,application/pdf,.pdf"
        multiple
        className="hidden"
        onChange={(e) => {
          addFiles(e.target.files);
          e.target.value = '';
        }}
      />

      <div className="space-y-3">
        {files.length === 0 ? (
          <p className="text-center text-sm text-text-muted">
            {UI_MESSAGES.empty.uploadFiles}
          </p>
        ) : (
          files.map((file) => (
            <div key={file.id} className="rounded-lg border border-gray-100 p-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex min-w-0 items-center gap-2">
                  <FileText className="h-4 w-4 shrink-0 text-gold" />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-brown">
                      {file.file.name}
                    </p>
                    <p className="text-xs text-text-muted">
                      {sectionLabel(file.documentType)} · {formatFileSize(file.file.size)}
                    </p>
                    {file.error && (
                      <p className="mt-1 text-xs text-danger">{file.error}</p>
                    )}
                  </div>
                </div>
                {file.status === 'done' ? (
                  <CheckCircle className="h-5 w-5 shrink-0 text-success" />
                ) : file.status !== 'uploading' ? (
                  <button
                    type="button"
                    onClick={() => setRemoveFileId(file.id)}
                    className="text-text-muted hover:text-danger"
                    aria-label="Remove file"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                ) : null}
              </div>
              {(file.status === 'uploading' || file.status === 'done') && (
                <>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-gray-100">
                    <div
                      className="h-full rounded-full bg-gold transition-all"
                      style={{ width: `${file.progress}%` }}
                    />
                  </div>
                  <p className="mt-1 text-right text-[10px] text-text-muted">
                    {file.progress}%
                  </p>
                </>
              )}
            </div>
          ))
        )}
      </div>

      <ConfirmDialog
        open={confirmUploadOpen}
        onClose={() => setConfirmUploadOpen(false)}
        onConfirm={() => void handleConfirm()}
        title={UI_MESSAGES.confirm.uploadTitle}
        message={UI_MESSAGES.confirm.uploadMessage(
          files.filter((file) => file.status === 'pending').length,
        )}
        confirmLabel="Upload"
        variant="warning"
        submitting={submitting}
      />

      <ConfirmDialog
        open={Boolean(removeFileId)}
        onClose={() => setRemoveFileId(null)}
        onConfirm={() => {
          if (removeFileId) removeFile(removeFileId);
          setRemoveFileId(null);
        }}
        title={UI_MESSAGES.confirm.removeFileTitle}
        message={UI_MESSAGES.confirm.removeFileMessage}
        confirmLabel="Remove"
      />
    </Modal>
  );
}

export function ReportFileItem({
  name,
  size,
  time,
  type,
}: {
  name: string;
  size: string;
  time: string;
  type: 'folder' | 'file';
}) {
  const Icon = type === 'folder' ? Folder : FileText;
  return (
    <div className="flex items-center justify-between rounded-lg bg-gray-50 px-4 py-3">
      <div className="flex items-center gap-3">
        <Icon className="h-5 w-5 text-gold" />
        <div>
          <p className="text-sm font-medium text-brown">{name}</p>
          <p className="text-xs text-text-muted">{time}</p>
        </div>
      </div>
      <span className="rounded-full bg-gold/15 px-2.5 py-0.5 text-xs font-medium text-gold">
        {size}
      </span>
    </div>
  );
}
