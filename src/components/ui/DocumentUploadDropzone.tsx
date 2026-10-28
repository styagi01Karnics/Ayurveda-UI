import { useRef } from 'react';
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
  const scrollPosition = useRef<{
    container: HTMLElement | null;
    top: number;
    windowX: number;
    windowY: number;
  } | null>(null);

  const rememberScrollPosition = (input: HTMLInputElement) => {
    const container = input.closest<HTMLElement>(
      '[data-modal-scroll-container]',
    );
    scrollPosition.current = {
      container,
      top: container?.scrollTop ?? 0,
      windowX: window.scrollX,
      windowY: window.scrollY,
    };
  };

  const restoreScrollPosition = () => {
    const saved = scrollPosition.current;
    if (!saved) return;
    const restore = () => {
      if (saved.container) saved.container.scrollTop = saved.top;
      if (
        window.scrollX !== saved.windowX ||
        window.scrollY !== saved.windowY
      ) {
        window.scrollTo(saved.windowX, saved.windowY);
      }
    };
    requestAnimationFrame(() => {
      restore();
      requestAnimationFrame(restore);
    });
  };

  return (
    <label
      className={cn(
        'relative flex cursor-pointer flex-col items-center justify-center gap-2 overflow-hidden rounded-xl border-2 border-dashed border-gold/50 bg-gold/5 px-4 py-8 text-center transition-colors hover:bg-gold/10',
        disabled && 'cursor-not-allowed opacity-60 hover:bg-gold/5',
        className,
      )}
    >
      <CloudUpload className="h-8 w-8 text-gold" />
      <p className="text-sm font-medium text-brown">{title}</p>
      <p className="text-xs text-text-muted">{hint}</p>
      <input
        type="file"
        className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
        accept={DOCUMENT_UPLOAD_ACCEPT}
        multiple
        disabled={disabled}
        onClick={(event) => rememberScrollPosition(event.currentTarget)}
        onChange={(event) => {
          const { files } = event.target;
          if (files?.length) onFilesSelected(files);
          event.target.value = '';
          restoreScrollPosition();
        }}
      />
    </label>
  );
}
