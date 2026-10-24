"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ContactLabels {
  name: string;
  email: string;
  phone: string;
  message: string;
  send: string;
  sending: string;
  success: string;
  errorSend: string;
  errorName: string;
  errorEmail: string;
  errorPhone: string;
  errorMessage: string;
}

export function ContactForm({ labels }: { labels: ContactLabels }) {
  const [sent, setSent] = useState(false);
  const [submitError, setSubmitError] = useState(false);
  const schema = z.object({
    name: z.string().min(2, labels.errorName),
    email: z.string().email(labels.errorEmail),
    phone: z.string().regex(/^[+\d\s()-]{7,16}$/, labels.errorPhone),
    message: z.string().min(10, labels.errorMessage),
  });
  type FormValues = z.infer<typeof schema>;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema), mode: "onTouched" });

  async function onSubmit(values: FormValues) {
    setSubmitError(false);
    // Submissions go to the server-side POST /api/contact handler, which
    // re-validates, rate-limits, stores durably and optionally forwards to a
    // webhook (CONTACT_WEBHOOK_URL). The hidden "company" field is a honeypot.
    const honeypot = document.getElementById("contact-company") as HTMLInputElement | null;
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, company: honeypot?.value ?? "" }),
      });
      if (!response.ok) {
        setSubmitError(true);
        return;
      }
      setSent(true);
      reset();
    } catch {
      // Network failure (offline / server down).
      setSubmitError(true);
    }
  }

  if (sent) {
    return (
      <p role="status" className="rounded-[var(--radius-md)] border border-[var(--color-success)]/20 bg-[var(--color-success)]/5 p-4 text-sm font-bold text-[var(--color-success)]">
        {labels.success}
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      <div>
        <label htmlFor="contact-name" className="mb-1 block text-sm font-bold">{labels.name}</label>
        <Input id="contact-name" {...register("name")} aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? "err-name" : undefined} />
        {errors.name && <p id="err-name" role="alert" className="mt-1 text-xs font-bold text-[var(--color-danger)]">{errors.name.message}</p>}
      </div>
      <div>
        <label htmlFor="contact-email" className="mb-1 block text-sm font-bold">{labels.email}</label>
        <Input id="contact-email" type="email" dir="ltr" {...register("email")} aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? "err-email" : undefined} />
        {errors.email && <p id="err-email" role="alert" className="mt-1 text-xs font-bold text-[var(--color-danger)]">{errors.email.message}</p>}
      </div>
      <div>
        <label htmlFor="contact-phone" className="mb-1 block text-sm font-bold">{labels.phone}</label>
        <Input id="contact-phone" dir="ltr" {...register("phone")} aria-invalid={Boolean(errors.phone)} aria-describedby={errors.phone ? "err-phone" : undefined} />
        {errors.phone && <p id="err-phone" role="alert" className="mt-1 text-xs font-bold text-[var(--color-danger)]">{errors.phone.message}</p>}
      </div>
      <div>
        <label htmlFor="contact-message" className="mb-1 block text-sm font-bold">{labels.message}</label>
        <textarea
          id="contact-message"
          rows={5}
          {...register("message")}
          aria-describedby={errors.message ? "err-message" : undefined}
          className="w-full resize-y rounded-[var(--radius-md)] border border-[var(--color-border-control)] bg-[var(--color-surface)] px-3 py-2.5 text-sm text-[var(--color-foreground)] placeholder:text-[var(--color-muted-foreground)] transition-colors focus:border-[var(--color-ring)] focus:outline-none focus:ring-2 focus:ring-[var(--color-ring)]/40 disabled:cursor-not-allowed disabled:opacity-50 aria-[invalid=true]:border-[var(--color-danger)]"
        />
        {errors.message && <p id="err-message" role="alert" className="mt-1 text-xs font-bold text-[var(--color-danger)]">{errors.message.message}</p>}
      </div>
      {/* Honeypot: visually hidden, unfocusable, off the tab order. Real users
          never fill it; bots do — the server drops those silently. */}
      <div className="sr-only" aria-hidden="true">
        <label htmlFor="contact-company">Company</label>
        <input id="contact-company" name="company" type="text" tabIndex={-1} autoComplete="off" />
      </div>
      {submitError && (
        <p role="alert" className="rounded-[var(--radius-md)] border border-[var(--color-danger)]/30 bg-[var(--color-danger)]/5 p-4 text-sm font-bold text-[var(--color-danger)]">
          {labels.errorSend}
        </p>
      )}
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? labels.sending : labels.send}
      </Button>
    </form>
  );
}
