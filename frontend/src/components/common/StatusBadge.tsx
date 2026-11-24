type StatusBadgeProps = {
  status: "Scheduled" | "Sent" | "Failed";
};

export default function StatusBadge({
  status,
}: StatusBadgeProps) {
  let color = "";

  switch (status) {
    case "Scheduled":
      color = "text-[#9a6a0c] bg-[#fdf1de] border-[#f6dfb2]";
      break;

    case "Sent":
      color = "text-[#0f6e56] bg-[#e1f5ee] border-[#bfe9dc]";
      break;

    case "Failed":
      color = "text-red-700 bg-red-50 border-red-200";
      break;
  }

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase border ${color}`}
    >
      {status}
    </span>
  );
}