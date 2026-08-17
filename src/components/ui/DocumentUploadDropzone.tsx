import { CloudUpload } from 'lucide-react';
import {
  DOCUMENT_UPLOAD_ACCEPT,
  DOCUMENT_UPLOAD_HINT,
} from '@/lib/documentUpload';
import { cn } from '@/lib/utils';

interface DocumentUploadDropzoneProps {
  onFilesSelected: (files: FileList) => void;
  disabled?: boolean;
  title?: string;
  hint?: string;
  className?: string;
}

export function DocumentUploadDropzone({
  onFilesSelected,
  disabled = false,
  title = 'Tap to upload document',
  hint = DOCUMENT_UPLOAD_HINT,
  className,
}: DocumentUploadDropzoneProps) {
  return (
    <label
      className={cn(
        'flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gold/50 bg-gold/5 px-4 py-8 text-center transition-colors hover:bg-gold/10',
        disabled && 'cursor-not-allowed opacity-60 hover:bg-gold/5',
        className,
      )}
    >
      <CloudUpload className="h-8 w-8 text-gold" />
      <p className="text-sm font-medium text-brown">{title}</p>
      <p className="text-xs text-text-muted">{hint}</p>
      <input
        type="file"
        className="sr-only"
        accept={DOCUMENT_UPLOAD_ACCEPT}
        multiple
        disabled={disabled}
        onChange={(event) => {
          const { files } = event.target;
          if (files?.length) onFilesSelected(files);
          event.target.value = '';
        }}
      />
    </label>
  );
}
