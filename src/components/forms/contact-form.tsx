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
  errorName: string;
  errorEmail: string;
  errorPhone: string;
  errorMessage: string;
}

export function ContactForm({ labels }: { labels: ContactLabels }) {
  const [sent, setSent] = useState(false);
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
    // Frontend-first: mock submission adapter. Swap with a Server Action / REST
    // endpoint via a ContactSubmissionService when a backend is available.
    await new Promise((r) => setTimeout(r, 500));
    console.info("contact-submission", values);
    setSent(true);
    reset();
  }

  if (sent) {
    return (
      <p role="status" className="rounded-[var(--radius-md)] border border-green-200 bg-green-50 p-4 text-sm font-bold text-[var(--color-success)]">
        {labels.success}
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      <div>
        <label htmlFor="contact-name" className="mb-1 block text-sm font-bold">{labels.name}</label>
        <Input id="contact-name" {...register("name")} aria-invalid={Boolean(errors.name)} aria-describedby="err-name" />
        {errors.name && <p id="err-name" role="alert" className="mt-1 text-xs font-bold text-[var(--color-danger)]">{errors.name.message}</p>}
      </div>
      <div>
        <label htmlFor="contact-email" className="mb-1 block text-sm font-bold">{labels.email}</label>
        <Input id="contact-email" type="email" dir="ltr" {...register("email")} aria-invalid={Boolean(errors.email)} aria-describedby="err-email" />
        {errors.email && <p id="err-email" role="alert" className="mt-1 text-xs font-bold text-[var(--color-danger)]">{errors.email.message}</p>}
      </div>
      <div>
        <label htmlFor="contact-phone" className="mb-1 block text-sm font-bold">{labels.phone}</label>
        <Input id="contact-phone" dir="ltr" {...register("phone")} aria-invalid={Boolean(errors.phone)} aria-describedby="err-phone" />
        {errors.phone && <p id="err-phone" role="alert" className="mt-1 text-xs font-bold text-[var(--color-danger)]">{errors.phone.message}</p>}
      </div>
      <div>
        <label htmlFor="contact-message" className="mb-1 block text-sm font-bold">{labels.message}</label>
        <textarea
          id="contact-message"
          rows={5}
          {...register("message")}
          aria-invalid={Boolean(errors.message)}
          aria-describedby="err-message"
          className="w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-ring)]/40"
        />
        {errors.message && <p id="err-message" role="alert" className="mt-1 text-xs font-bold text-[var(--color-danger)]">{errors.message.message}</p>}
      </div>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? labels.sending : labels.send}
      </Button>
    </form>
  );
}
