import { Email } from "@/types/emails";
import StatusBadge from "../common/StatusBadge";

type EmailTableProps = {
  emails: Email[];
};

const formatToIST = (isoString: string) => {
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) {
    return isoString;
  }

  return date.toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZoneName: "short",
  });
};

export default function EmailTable({ emails }: EmailTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-[var(--color-brand-cream)] text-[var(--color-brand-muted)] text-xs uppercase tracking-wider border-b border-[var(--color-brand-line)]">
            <th className="text-left p-4 font-semibold">Recipient</th>
            <th className="text-left p-4 font-semibold">Subject</th>
            <th className="text-left p-4 font-semibold">Schedule (IST)</th>
            <th className="text-left p-4 font-semibold">Status</th>
          </tr>
        </thead>

        <tbody>
          {emails.map((email) => (
            <tr
              key={email.id}
              className="border-b border-[var(--color-brand-line)] hover:bg-[var(--color-brand-cream)]/50 transition text-[var(--color-brand-ink)]"
            >
              <td className="p-4">{email.recipient}</td>

              <td className="p-3">{email.subject}</td>

              <td className="p-3">
                {formatToIST(email.scheduledAt)}
              </td>

              <td className="p-3">
                <StatusBadge
                  status={email.status}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}