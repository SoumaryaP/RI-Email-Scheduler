export default function Sidebar() {
  return (
    <aside className="w-64 bg-white border-r border-[var(--color-brand-line)] h-screen p-6 text-[var(--color-brand-ink)]">
      <ul className="space-y-4">
        <li className="font-medium cursor-pointer hover:text-[var(--color-brand-navy)] transition">
          Compose Email
        </li>

        <li className="font-medium cursor-pointer hover:text-[var(--color-brand-navy)] transition">
          Scheduled Emails
        </li>

        <li className="font-medium cursor-pointer hover:text-[var(--color-brand-navy)] transition">
          Sent Emails
        </li>

        <li className="font-medium cursor-pointer hover:text-[var(--color-brand-navy)] transition">
          Settings
        </li>
      </ul>
    </aside>
  );
}