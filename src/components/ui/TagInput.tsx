import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TagInputProps {
  label?: string;
  value: string[];
  onChange: (tags: string[]) => void;
  options: readonly string[];
  error?: string;
  placeholder?: string;
}

export function TagInput({
  label,
  value,
  onChange,
  options,
  error,
  placeholder = 'Select',
}: TagInputProps) {
  const available = options.filter((opt) => !value.includes(opt));

  const addTag = (tag: string) => {
    if (!value.includes(tag)) onChange([...value, tag]);
  };

  const removeTag = (tag: string) => {
    onChange(value.filter((t) => t !== tag));
  };

  return (
    <div className="flex w-full flex-col gap-1.5">
      {label && (
        <span className="text-xs font-medium text-text-muted">{label}</span>
      )}
      <div
        className={cn(
          'flex min-h-[42px] flex-wrap items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2',
          error && 'border-danger',
        )}
      >
        {value.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 rounded-md bg-gold/15 px-2 py-0.5 text-xs font-medium text-brown"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="text-text-muted hover:text-danger"
              aria-label={`Remove ${tag}`}
            >
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}
        {available.length > 0 && (
          <select
            value=""
            onChange={(e) => {
              if (e.target.value) addTag(e.target.value);
            }}
            className="min-w-[100px] flex-1 border-none bg-transparent text-sm text-gray-400 focus:outline-none"
          >
            <option value="">{placeholder}</option>
            {available.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        )}
      </div>
      {error && (
        <p className="text-xs text-danger" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
