export interface Email {
  id: number;
  recipient: string;
  subject: string;
  body: string;
  scheduledAt: string;
  status: "Scheduled" | "Sent" | "Failed";
}