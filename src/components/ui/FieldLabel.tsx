import { cn } from '@/lib/utils';

interface FieldLabelProps {
  htmlFor?: string;
  label: string;
  className?: string;
  as?: 'label' | 'span';
}

/** Renders field labels with a red asterisk when the label ends with `*`. */
export function FieldLabel({
  htmlFor,
  label,
  className,
  as = 'label',
}: FieldLabelProps) {
  const required = /\*\s*$/.test(label);
  const text = label.replace(/\s*\*\s*$/, '').trimEnd();
  const classes = cn(className);

  if (as === 'span') {
    return (
      <span className={classes}>
        {text}
        {required ? <span className="text-danger"> *</span> : null}
      </span>
    );
  }

  return (
    <label htmlFor={htmlFor} className={classes}>
      {text}
      {required ? <span className="text-danger"> *</span> : null}
    </label>
  );
}
