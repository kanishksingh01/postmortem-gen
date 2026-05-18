"use client";

import { useState } from "react";
import { SeverityBadge } from "./SeverityBadge";

export interface IncidentFormData {
  title: string;
  severity: string;
  datetime: string;
  duration: string;
  affectedServices: string;
  whatHappened: string;
  timeline: string;
  customerImpact: string;
}

const EXAMPLE_DATA: IncidentFormData = {
  title: "Database Connection Pool Exhausted — Production",
  severity: "P1",
  datetime: "2025-04-10T14:23",
  duration: "45m",
  affectedServices: "api-gateway, user-service, checkout-service",
  whatHappened:
    "Database connection pool hit maximum capacity (500/500 connections) causing cascading failures across all services that depend on the primary PostgreSQL instance. New requests were queued then dropped as the pool wait timeout (30s) was exceeded.",
  timeline:
    "14:23 - Alert fired: DB connection count > 95% (475/500)\n14:25 - On-call paged via PagerDuty\n14:31 - On-call engineer acknowledged and began investigation\n14:38 - Root cause identified: runaway query from new deployment\n14:45 - Decision made to roll back the deployment\n14:52 - Rollback completed, connection count began dropping\n15:08 - Connection pool normalized, services recovered fully",
  customerImpact:
    "Approximately 3,000 users were unable to complete checkout for 45 minutes. Error rate on api-gateway reached 78%. Customer support received 142 tickets. Estimated revenue impact: $12,000.",
};

interface IncidentFormProps {
  onSubmit: (data: IncidentFormData) => void;
  isGenerating: boolean;
}

const inputClass =
  "w-full bg-[#0a0a0a] border border-[#222] rounded-md px-3 py-2.5 text-sm text-zinc-200 focus:border-amber-500 focus:outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed";

const labelClass =
  "block text-xs font-semibold text-zinc-400 mb-1.5 uppercase tracking-widest font-mono";

export function IncidentForm({ onSubmit, isGenerating }: IncidentFormProps) {
  const [form, setForm] = useState<IncidentFormData>({
    title: "",
    severity: "P2",
    datetime: "",
    duration: "",
    affectedServices: "",
    whatHappened: "",
    timeline: "",
    customerImpact: "",
  });

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function loadExample() {
    setForm(EXAMPLE_DATA);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim() || !form.whatHappened.trim()) return;
    onSubmit(form);
  }

  const isValid = form.title.trim() !== "" && form.whatHappened.trim() !== "";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {/* Load Example button */}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={loadExample}
          className="bg-transparent border border-[#222] rounded-md px-3.5 py-1.5 text-zinc-400 text-xs font-mono cursor-pointer transition-colors hover:border-amber-500 hover:text-amber-400"
        >
          Load Example
        </button>
      </div>

      {/* Title */}
      <div>
        <label className={labelClass} htmlFor="title">
          Incident Title *
        </label>
        <input
          id="title"
          name="title"
          type="text"
          value={form.title}
          onChange={handleChange}
          placeholder="What was the incident?"
          required
          disabled={isGenerating}
          className={inputClass}
        />
      </div>

      {/* Severity + Datetime row */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass} htmlFor="severity">
            Severity
          </label>
          <div className="relative">
            <select
              id="severity"
              name="severity"
              value={form.severity}
              onChange={handleChange}
              disabled={isGenerating}
              className={`${inputClass} appearance-none cursor-pointer pr-9`}
            >
              <option value="P1">P1 — Critical</option>
              <option value="P2">P2 — High</option>
              <option value="P3">P3 — Medium</option>
              <option value="P4">P4 — Low</option>
            </select>
            <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500 text-[10px]">
              ▼
            </span>
          </div>
          <div className="mt-2">
            <SeverityBadge severity={form.severity} />
          </div>
        </div>

        <div>
          <label className={labelClass} htmlFor="datetime">
            Date &amp; Time
          </label>
          <input
            id="datetime"
            name="datetime"
            type="datetime-local"
            value={form.datetime}
            onChange={handleChange}
            disabled={isGenerating}
            className={inputClass}
            style={{ colorScheme: "dark" }}
          />
        </div>
      </div>

      {/* Duration + Affected Services row */}
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className={labelClass} htmlFor="duration">
            Duration
          </label>
          <input
            id="duration"
            name="duration"
            type="text"
            value={form.duration}
            onChange={handleChange}
            placeholder="e.g. 2h 15m"
            disabled={isGenerating}
            className={inputClass}
          />
        </div>

        <div className="col-span-2">
          <label className={labelClass} htmlFor="affectedServices">
            Affected Services
          </label>
          <input
            id="affectedServices"
            name="affectedServices"
            type="text"
            value={form.affectedServices}
            onChange={handleChange}
            placeholder="api-gateway, user-service, checkout-service"
            disabled={isGenerating}
            className={inputClass}
          />
        </div>
      </div>

      {/* What Happened */}
      <div>
        <label className={labelClass} htmlFor="whatHappened">
          What Happened *
        </label>
        <textarea
          id="whatHappened"
          name="whatHappened"
          value={form.whatHappened}
          onChange={handleChange}
          placeholder="Brief description of the incident..."
          required
          rows={4}
          disabled={isGenerating}
          className={`${inputClass} resize-y leading-relaxed`}
        />
      </div>

      {/* Timeline */}
      <div>
        <label className={labelClass} htmlFor="timeline">
          Timeline
        </label>
        <textarea
          id="timeline"
          name="timeline"
          value={form.timeline}
          onChange={handleChange}
          placeholder={"14:32 - Alert fired\n14:35 - On-call paged\n14:41 - Root cause identified\n..."}
          rows={6}
          disabled={isGenerating}
          className={`${inputClass} resize-y leading-relaxed font-mono text-[13px]`}
        />
      </div>

      {/* Customer Impact */}
      <div>
        <label className={labelClass} htmlFor="customerImpact">
          Customer Impact
        </label>
        <textarea
          id="customerImpact"
          name="customerImpact"
          value={form.customerImpact}
          onChange={handleChange}
          placeholder="How many users affected? What did they experience?"
          rows={3}
          disabled={isGenerating}
          className={`${inputClass} resize-y leading-relaxed`}
        />
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={!isValid || isGenerating}
        className={`flex items-center justify-center gap-2 rounded-md px-6 py-3 text-sm font-bold tracking-wide transition-colors
          ${
            isValid && !isGenerating
              ? "bg-amber-500 text-black cursor-pointer hover:bg-amber-400"
              : "bg-[#222] text-zinc-500 cursor-not-allowed"
          }`}
      >
        {isGenerating ? (
          <>
            <span className="inline-block w-3.5 h-3.5 border-2 border-zinc-500 border-t-amber-400 rounded-full animate-spin" />
            Generating...
          </>
        ) : (
          "⚡ Generate Postmortem"
        )}
      </button>
    </form>
  );
}
