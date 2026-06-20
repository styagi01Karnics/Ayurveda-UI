import { useRef, useState } from 'react';
import {
  CheckCircle,
  CloudUpload,
  FileText,
  Folder,
  Trash2,
} from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import type { PatientRecord } from '@/types';

interface UploadFile {
  id: string;
  name: string;
  size: string;
  progress: number;
  done: boolean;
}

interface UploadReportsModalProps {
  open: boolean;
  onClose: () => void;
  patient?: PatientRecord | null;
}

const defaultFiles: UploadFile[] = [
  { id: '1', name: 'Tech design requirements.pdf', size: '200 KB', progress: 100, done: true },
  { id: '2', name: 'Dashboard recording.mp4', size: '16 MB', progress: 40, done: false },
];

export function UploadReportsModal({
  open,
  onClose,
  patient,
}: UploadReportsModalProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<UploadFile[]>(defaultFiles);
  const [activeSection, setActiveSection] = useState('Past Medical Reports');

  const sections = ['Past Medical Reports', 'PRESCRIPTIONS', 'LAB REPORTS'];

  const handleClose = () => {
    setFiles(defaultFiles);
    onClose();
  };

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Upload Reports"
      size="md"
      footer={
        <div className="flex w-full justify-end gap-3">
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleClose}>Confirm</Button>
        </div>
      }
    >
      {patient && (
        <p className="mb-4 text-sm text-text-muted">
          Uploading for <span className="font-medium text-brown">{patient.name}</span>{' '}
          ({patient.id})
        </p>
      )}

      <div className="mb-4 flex flex-wrap gap-4 text-xs font-medium uppercase tracking-wide">
        {sections.map((section) => (
          <button
            key={section}
            type="button"
            onClick={() => setActiveSection(section)}
            className={cn(
              activeSection === section ? 'text-gold' : 'text-text-muted hover:text-brown',
            )}
          >
            {section}
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="mb-4 flex w-full flex-col items-center gap-2 rounded-xl border-2 border-dashed border-gold/40 bg-gold/5 py-8 text-center hover:bg-gold/10"
      >
        <CloudUpload className="h-8 w-8 text-gold" />
        <span className="text-sm font-medium text-brown">Tap to upload photo</span>
        <span className="text-xs text-text-muted">Supported: .jpg, .jpeg, .png</span>
      </button>
      <input ref={inputRef} type="file" accept="image/*,.pdf" className="hidden" />

      <div className="space-y-3">
        {files.map((file) => (
          <div key={file.id} className="rounded-lg border border-gray-100 p-3">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 shrink-0 text-gold" />
                <div>
                  <p className="text-sm font-medium text-brown">{file.name}</p>
                  <p className="text-xs text-text-muted">{file.size}</p>
                </div>
              </div>
              {file.done ? (
                <CheckCircle className="h-5 w-5 text-success" />
              ) : (
                <button
                  type="button"
                  onClick={() => removeFile(file.id)}
                  className="text-text-muted hover:text-danger"
                  aria-label="Remove file"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-gray-100">
              <div
                className="h-full rounded-full bg-gold transition-all"
                style={{ width: `${file.progress}%` }}
              />
            </div>
            <p className="mt-1 text-right text-[10px] text-text-muted">{file.progress}%</p>
          </div>
        ))}
      </div>
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
