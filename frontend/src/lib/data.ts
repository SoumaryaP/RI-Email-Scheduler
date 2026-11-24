
import { Email } from "@/types/emails";
export const scheduledEmails: Email[] = [
  {
    id: 1,
    recipient: "john@gmail.com",
    subject: "Interview Invitation",
    body: "Hello John",
    scheduledAt: "26 Jul 2026 08:30 PM",
    status: "Scheduled",
  },
  {
    id: 2,
    recipient: "alice@gmail.com",
    subject: "Offer Letter",
    body: "Congratulations",
    scheduledAt: "27 Jul 2026 10:00 AM",
    status: "Sent",
  },
  {
    id: 3,
    recipient: "bob@gmail.com",
    subject: "Meeting Reminder",
    body: "Don't forget the meeting.",
    scheduledAt: "28 Jul 2026 03:00 PM",
    status: "Failed",
  },
];