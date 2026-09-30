import { useCallback, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { assets } from '@/lib/assets';

interface FileUploadProps {
  label: string;
  value?: File;
  onChange: (file: File | undefined) => void;
  error?: string;
  accept?: string;
  editOnly?: boolean;
  /** Override the action link text (default: "Edit your {label}"). */
  actionLabel?: string;
  /** Remote image URL from API (logoUrl / photoUrl). */
  previewUrl?: string | null;
  /** When true, hide edit actions and block file changes. */
  disabled?: boolean;
}

export function FileUpload({
  label,
  value,
  onChange,
  error,
  accept = 'image/svg+xml,image/png,image/jpeg,image/gif',
  editOnly = false,
  actionLabel,
  previewUrl,
  disabled = false,
}: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const displayPreview = preview || previewUrl || null;

  const handleFile = useCallback(
    (file: File | undefined) => {
      if (disabled) return;
      if (preview) URL.revokeObjectURL(preview);
      if (file) {
        setPreview(URL.createObjectURL(file));
        onChange(file);
      } else {
        setPreview(null);
        onChange(undefined);
      }
    },
    [disabled, onChange, preview],
  );

  const onDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const shortLabel = label.replace(/^Your /, '');
  const isPhoto = label.toLowerCase().includes('photo');

  return (
    <div className="flex h-full flex-col gap-2.5">
      <p className="text-xs font-medium text-brown">{label}</p>
      <div className="h-px w-full bg-[#DBDCDE]" />

      <div className="flex items-center gap-2.5">
        <div className="h-8 w-8 shrink-0 overflow-hidden rounded-full bg-[#F5E6A8]">
          <img
            src={preview ?? assets.auth.signupAvatar}
            alt=""
            className="h-full w-full object-cover"
          />
        </div>
        <div className="flex min-w-0 flex-col gap-0.5">
          <button
            type="button"
            className="text-left text-xs font-medium text-brown"
            onClick={() => inputRef.current?.click()}
          >
            Edit your {isPhoto ? 'photo' : shortLabel}
          </button>
          {!editOnly ? (
            <div className="flex items-center gap-2 text-[11px] leading-none">
              <button
                type="button"
                className="text-left text-[#737373] hover:text-danger"
                onClick={() => {
                  handleFile(undefined);
                  if (inputRef.current) inputRef.current.value = '';
                }}
              >
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
          ) : null}
        </div>
      </div>

      {!editOnly ? (
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
            'flex min-h-[168px] flex-1 cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border-[1.5px] border-dashed border-gold bg-transparent px-3 py-8 text-center transition-colors',
            isDragging && 'bg-gold/5',
            error && 'border-danger',
          )}
        >
          <img
            src={assets.auth.signupUploadIcon}
            alt=""
            className="mb-1 h-8 w-8 object-contain"
          />
          <p className="text-[12px] font-medium leading-tight text-gold">
            Click to upload or drag and drop
          </p>
          <p className="text-[11px] font-medium leading-tight text-brown">
            SVG, PNG, JPG or GIF
          </p>
          <p className="text-[11px] leading-tight text-brown">
            (max, 800×400px)
          </p>
          {value && <p className="text-xs text-success">{value.name}</p>}
        </div>
      ) : null}

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        disabled={disabled}
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
