"use client";
import {useState, useEffect} from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import Card from "@/components/common/Card";
import ComposeForm from "@/components/compose/ComposeForm";
import EmailTable from "@/components/tables/EmailTable";
import { Email } from "@/types/emails";
import { api } from "@/lib/axios";
import { toast } from "react-hot-toast";

export default function Dashboard() {
  const [scheduledEmails, setScheduledEmails] = useState<Email[]>([]);
  const [sentEmails, setSentEmails] = useState<Email[]>([]);
  const [activeTab, setActiveTab] = useState<"SCHEDULED" | "SENT">("SCHEDULED");

  const fetchScheduledEmails = async () => {
    try {
      const res = await api.get("/emails/scheduled");
      setScheduledEmails(res.data.data);
    } catch (error) {
      console.error("Failed to fetch scheduled emails", error);
    }
  };

  const fetchSentEmails = async () => {
    try {
      const res = await api.get("/emails/sent");
      setSentEmails(res.data.data);
    } catch (error) {
      console.error("Failed to fetch sent emails", error);
    }
  };

  useEffect(() => {
    fetchScheduledEmails();
    fetchSentEmails();
  }, []);

  const addEmail = (emailOrEmails: Email | Email[]) => {
    setScheduledEmails((prev) => {
      if (Array.isArray(emailOrEmails)) {
        return [...emailOrEmails, ...prev];
      }
      return [emailOrEmails, ...prev];
    });
  };

  return (
    <DashboardLayout>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h2 className="text-2xl font-bold mb-6">
            Compose Email
          </h2>
          <ComposeForm onAddEmail={addEmail} />
        </Card>

        <Card>
          <div className="flex justify-between items-center mb-6 border-b border-[var(--color-brand-line)] pb-2">
            <h2 className="text-2xl font-bold">
              Emails
            </h2>
            <div className="flex gap-4">
              <button 
                onClick={() => setActiveTab("SCHEDULED")}
                className={`font-semibold pb-2 -mb-[9px] transition ${activeTab === "SCHEDULED" ? "text-[var(--color-brand-navy)] border-b-2 border-[var(--color-brand-navy)]" : "text-[var(--color-brand-muted)] hover:text-[var(--color-brand-ink)]"}`}
              >
                Scheduled
              </button>
              <button 
                onClick={() => setActiveTab("SENT")}
                className={`font-semibold pb-2 -mb-[9px] transition ${activeTab === "SENT" ? "text-[var(--color-brand-navy)] border-b-2 border-[var(--color-brand-navy)]" : "text-[var(--color-brand-muted)] hover:text-[var(--color-brand-ink)]"}`}
              >
                Sent
              </button>
            </div>
          </div>
          
          {activeTab === "SCHEDULED" ? (
             scheduledEmails.length === 0 ? (
               <div className="text-gray-500 text-center py-10">No scheduled emails.</div>
             ) : (
               <EmailTable emails={scheduledEmails} />
             )
          ) : (
             sentEmails.length === 0 ? (
               <div className="text-gray-500 text-center py-10">No sent emails.</div>
             ) : (
               <EmailTable emails={sentEmails} />
             )
          )}
        </Card>
      </div>
    </DashboardLayout>
  );
}