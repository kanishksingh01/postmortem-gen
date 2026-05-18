import Groq from "groq-sdk";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

  const body = await req.json().catch(() => null);
  if (!body?.title) {
    return new Response(JSON.stringify({ error: "Missing incident details" }), { status: 400 });
  }

  const { title, severity, datetime, duration, affectedServices, whatHappened, timeline, customerImpact } = body;

  const userPrompt = `
Incident Title: ${title}
Severity: ${severity}
Date/Time: ${datetime}
Duration: ${duration}
Affected Services: ${affectedServices}
What Happened: ${whatHappened}
Timeline:
${timeline}
Customer Impact: ${customerImpact}
`;

  const systemPrompt = `You are a senior SRE writing a professional incident postmortem. Generate a structured postmortem in Markdown. Use exactly this structure:

# Incident Postmortem: [Title]

## Executive Summary
[2-3 sentence summary of what happened, impact, and resolution]

## Incident Details
| Field | Value |
|-------|-------|
| Severity | [value] |
| Date/Time | [value] |
| Duration | [value] |
| Affected Services | [value] |

## Timeline
[Format each timeline event as: **HH:MM** — Event description]

## Root Cause Analysis
[Identify the most likely root cause based on what happened]

## Contributing Factors
- [Factor 1]
- [Factor 2]
- [Factor 3]
- [Factor 4]

## Impact
[Quantify the customer and business impact]

## Resolution
[What fixed the incident]

## Action Items
| Priority | Action | Owner | Due Date |
|----------|--------|-------|----------|
| P1 | [action] | [team] | [date] |
[5-7 rows total]

## Lessons Learned
- [Lesson 1]
- [Lesson 2]
- [Lesson 3]

Write in professional SRE style. Be specific and actionable. Infer reasonable details where needed.`;

  const stream = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    max_tokens: 2000,
    stream: true,
  });

  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        const text = chunk.choices[0]?.delta?.content ?? "";
        if (text) controller.enqueue(encoder.encode(text));
      }
      controller.close();
    },
  });

  return new Response(readable, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
