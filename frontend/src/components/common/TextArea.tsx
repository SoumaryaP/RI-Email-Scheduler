import { UseFormRegisterReturn } from "react-hook-form";

type TextAreaProps = {
  label: string;
  placeholder?: string;
  rows?: number;
  registration: UseFormRegisterReturn;
  error?: string;
};

export default function TextArea({
  label,
  placeholder,
  rows = 5,
  registration,
  error,
}: TextAreaProps) {
  return (
    <div className="flex flex-col gap-2">
      <label className="font-semibold text-[var(--color-brand-ink)]">
        {label}
      </label>

      <textarea
        rows={rows}
        placeholder={placeholder}
        {...registration}
        className={`border rounded-lg px-4 py-2 outline-none transition resize-none bg-white text-[var(--color-brand-ink)] placeholder-[var(--color-brand-muted)]
        ${
          error
            ? "border-red-500 focus:ring-2 focus:ring-red-400"
            : "border-[var(--color-brand-line)] focus:ring-2 focus:ring-[var(--color-brand-mint)] focus:border-[var(--color-brand-mint)]"
        }`}
      />

      {error && (
        <p className="text-red-500 text-sm">
          {error}
        </p>
      )}
    </div>
  );
}