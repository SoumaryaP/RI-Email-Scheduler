"use client";

type DateTimePickerProps = {
  label: string;
  registration: any;
  error?: string;
};

export default function DateTimePicker({
  label,
  registration,
  error,
}: DateTimePickerProps) {
  return (
    <div className="flex flex-col gap-2">
      <label className="font-semibold text-[var(--color-brand-ink)]">{label}</label>

      <input
        type="datetime-local"
        {...registration}
        className={`border rounded-lg px-4 py-2 outline-none transition bg-white text-[var(--color-brand-ink)] ${
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