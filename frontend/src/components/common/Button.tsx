type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
};

export default function Button({
  children,
  onClick,
  type = "button",
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      className="bg-[var(--color-brand-navy)] hover:bg-[var(--color-brand-navy-hover)] text-white px-5 py-2.5 rounded-xl font-semibold transition"
    >
      {children}
    </button>
  );
}