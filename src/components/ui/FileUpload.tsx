import { useCallback, useRef, useState } from 'react';
import { CloudUpload, Pencil, Trash2, User } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FileUploadProps {
  label: string;
  value?: File;
  onChange: (file: File | undefined) => void;
  error?: string;
  accept?: string;
}

export function FileUpload({
  label,
  value,
  onChange,
  error,
  accept = 'image/svg+xml,image/png,image/jpeg,image/gif',
}: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = useCallback(
    (file: File | undefined) => {
      if (preview) URL.revokeObjectURL(preview);
      if (file) {
        setPreview(URL.createObjectURL(file));
        onChange(file);
      } else {
        setPreview(null);
        onChange(undefined);
      }
    },
    [onChange, preview],
  );

  const onDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const shortLabel = label.replace(/^Your /, '');

  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm font-semibold text-brown">{label}</p>

      <div className="flex items-start gap-3">
        <div className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gold/10">
          {preview ? (
            <img src={preview} alt="" className="h-full w-full object-cover" />
          ) : (
            <User className="h-7 w-7 text-gold" />
          )}
          <button
            type="button"
            className="absolute -bottom-0.5 -right-0.5 rounded-full bg-gold p-1 text-white"
            onClick={() => inputRef.current?.click()}
            aria-label={`Edit ${label}`}
          >
            <Pencil className="h-3 w-3" />
          </button>
        </div>

        <div className="flex flex-col gap-1 text-xs">
          <button
            type="button"
            className="text-left font-medium text-gold hover:underline"
            onClick={() => inputRef.current?.click()}
          >
            Edit your {shortLabel}
          </button>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="flex items-center gap-1 text-left text-text-muted hover:text-danger"
              onClick={() => {
                handleFile(undefined);
                if (inputRef.current) inputRef.current.value = '';
              }}
            >
              <Trash2 className="h-3 w-3" />
              Delete
            </button>
            <button
              type="button"
              className="text-left font-medium text-gold hover:underline"
              onClick={() => inputRef.current?.click()}
            >
              Update
            </button>
          </div>
        </div>
      </div>

      <div
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={onDrop}
        className={cn(
          'flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gold/50 bg-gold/5 px-4 py-6 text-center transition-colors hover:bg-gold/10',
          isDragging && 'border-gold bg-gold/15',
          error && 'border-danger',
        )}
      >
        <CloudUpload className="h-8 w-8 text-gold" />
        <p className="text-sm text-brown">
          <span className="font-medium text-gold">Click to upload</span> or drag and drop
        </p>
        <p className="text-xs text-text-muted">
          SVG, PNG, JPG or GIF (max. 800x400px)
        </p>
        {value && (
          <p className="text-xs text-success">{value.name}</p>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />

      {error && (
        <p className="text-xs text-danger" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
