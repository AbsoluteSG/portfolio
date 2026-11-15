"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { siteConfig } from "@/config/site";
import { contactSchema, type ContactFormData } from "@/lib/validators";

type SubmitStatus = "idle" | "loading" | "success" | "error";

/** Validated contact form. Posts to /api/contact; on any failure it offers the email address instead. */
export function ContactForm() {
  const [status, setStatus] = useState<SubmitStatus>("idle");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setStatus("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to send");
      setStatus("success");
      reset();
    } catch {
      setStatus("error");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
    <div className="grid gap-5 sm:grid-cols-2">
      <div className="space-y-2">
        <Label htmlFor="name" className="text-base">Name</Label>
        <Input
          id="name"
          placeholder="Your name"
          className="h-12 px-4 text-base md:text-base"
          {...register("name")}
        />
        {errors.name && (
          <p className="text-xs text-destructive">
            {errors.name.message}
          </p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="email" className="text-base">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="you@example.com"
          className="h-12 px-4 text-base md:text-base"
          {...register("email")}
        />
        {errors.email && (
          <p className="text-xs text-destructive">
            {errors.email.message}
          </p>
        )}
      </div>
    </div>

    <div className="space-y-2">
      <Label htmlFor="subject" className="text-base">Subject (optional)</Label>
      <Input
        id="subject"
        placeholder="What's this about?"
        className="h-12 px-4 text-base md:text-base"
        {...register("subject")}
      />
    </div>

    <div className="space-y-2">
      <Label htmlFor="message" className="text-base">Message</Label>
      <Textarea
        id="message"
        placeholder="Your message..."
        rows={6}
        className="px-4 py-3 text-base md:text-base"
        {...register("message")}
      />
      {errors.message && (
        <p className="text-xs text-destructive">
          {errors.message.message}
        </p>
      )}
    </div>

    <Button
      type="submit"
      size="lg"
      className="h-12 w-full text-base"
      disabled={status === "loading"}
    >
      {status === "loading" ? (
        <>
          <Loader2 className="mr-2 size-5 animate-spin" />
          Sending...
        </>
      ) : (
        <>
          <Send className="mr-2 size-5" />
          Send Message
        </>
      )}
    </Button>

    {status === "success" && (
      <p className="text-center text-sm text-green-600 dark:text-green-400">
        Message sent! I&apos;ll get back to you soon.
      </p>
    )}
    {status === "error" && (
      <p className="text-center text-sm text-destructive">
        Something went wrong. Please email me directly at{" "}
        <a href={`mailto:${siteConfig.email}`} className="underline">
          {siteConfig.email}
        </a>
        .
      </p>
    )}
  </form>
  );
}
