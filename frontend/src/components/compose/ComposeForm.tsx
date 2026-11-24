"use client";

import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "@/lib/axios";
import { toast } from "react-hot-toast";
import Button from "@/components/common/Button";
import Input from "@/components/common/Input";
import TextArea from "@/components/common/TextArea";
import DateTimePicker from "@/components/common/DateTimePicker";
import { Email } from "@/types/emails";

const emailSchema = z.object({
  recipient: z.string().optional(),
  subject: z.string().min(1, "Subject is required"),
  body: z.string().min(1, "Message is required"),
  scheduledAt: z.string().min(1, "Please select date and time"),
  delay: z.coerce.number().min(0, "Must be >= 0").default(0),
  hourlyLimit: z.coerce.number().min(1, "Must be >= 1").default(100),
});

type EmailFormData = z.infer<typeof emailSchema>;

type ComposeFormProps = {
  onAddEmail: (email: Email | Email[]) => void;
};

export default function ComposeForm({
  onAddEmail,
}: ComposeFormProps) {
  const [file, setFile] = useState<File | null>(null);
  const [emailCount, setEmailCount] = useState<number>(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EmailFormData>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      recipient: "",
      subject: "",
      body: "",
      delay: 0,
      hourlyLimit: 100,
    },
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const text = await selectedFile.text();
      const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
      const matches = text.match(emailRegex) || [];
      const uniqueEmails = [...new Set(matches)];
      setEmailCount(uniqueEmails.length);
    }
  };

  const onSubmit = async (data: EmailFormData) => {
    if (!file && !data.recipient) {
      toast.error("Please provide a recipient email or upload a CSV");
      return;
    }

    try {
      if (file) {
        // Bulk CSV upload
        const formData = new FormData();
        formData.append("file", file);
        formData.append("subject", data.subject);
        formData.append("body", data.body);
        formData.append("scheduledAt", new Date(data.scheduledAt).toISOString());
        formData.append("delay", data.delay.toString());
        formData.append("hourlyLimit", data.hourlyLimit.toString());

        const res = await api.post("/emails/schedule/csv", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success(`Scheduled ${res.data.count} emails!`);
        if (Array.isArray(res.data.data)) {
          res.data.data.forEach((e: Email) => onAddEmail(e));
        }
      } else {
        // Single schedule
        const res = await api.post("/emails/schedule", {
          recipient: data.recipient,
          subject: data.subject,
          body: data.body,
          scheduledAt: new Date(data.scheduledAt).toISOString(),
          delay: data.delay,
          hourlyLimit: data.hourlyLimit,
        });
        toast.success("Email scheduled!");
        if (Array.isArray(res.data.data)) {
          res.data.data.forEach((e: Email) => onAddEmail(e));
        } else {
          onAddEmail(res.data.data);
        }
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to schedule");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Recipient Input */}
        <div>
          <Input
            label="Single Recipient"
            type="email"
            placeholder="john@gmail.com"
            registration={register("recipient")}
            error={errors.recipient?.message}
          />
        </div>

        {/* File Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Or Upload CSV/Text Leads
          </label>
          <input
            type="file"
            accept=".csv,.txt"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="block w-full text-sm text-[var(--color-brand-muted)] file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-[var(--color-brand-cream)] file:text-[var(--color-brand-navy)] hover:file:bg-[var(--color-brand-line)] border border-[var(--color-brand-line)] rounded-md p-1 bg-white cursor-pointer"
          />
          {file && (
            <p className="mt-1 text-sm text-green-600">
              {emailCount} unique email{emailCount !== 1 && "s"} detected.
            </p>
          )}
        </div>
      </div>

      <Input
        label="Subject"
        placeholder="Interview Invitation"
        registration={register("subject")}
        error={errors.subject?.message}
      />

      <TextArea
        label="Message"
        placeholder="Write your email..."
        registration={register("body")}
        error={errors.body?.message}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <DateTimePicker
          label="Schedule Date & Time"
          registration={register("scheduledAt")}
          error={errors.scheduledAt?.message}
        />
        
        <Input
          label="Delay (seconds)"
          type="number"
          placeholder="0"
          registration={register("delay")}
          error={errors.delay?.message}
        />

        <Input
          label="Hourly Limit"
          type="number"
          placeholder="100"
          registration={register("hourlyLimit")}
          error={errors.hourlyLimit?.message}
        />
      </div>

      <Button type="submit">Schedule Emails</Button>
    </form>
  );
}