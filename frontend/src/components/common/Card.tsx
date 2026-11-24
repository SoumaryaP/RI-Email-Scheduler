type CardProps = {
  children: React.ReactNode;
};

export default function Card({
  children,
}: CardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-[var(--color-brand-line)] p-6">
      {children}
    </div>
  );
}