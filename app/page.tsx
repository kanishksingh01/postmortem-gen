"use client";

import { useState } from "react";
import { IncidentForm, IncidentFormData } from "@/components/IncidentForm";
import { PostmortemOutput } from "@/components/PostmortemOutput";

export default function Home() {
  const [output, setOutput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);

  const handleGenerate = async (data: IncidentFormData) => {
    setOutput("");
    setIsStreaming(true);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Generation failed");

      const reader = res.body!.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        setOutput((prev) => prev + decoder.decode(value, { stream: true }));
      }
    } catch {
      setOutput("Error generating postmortem. Check your GROQ_API_KEY.");
    } finally {
      setIsStreaming(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-zinc-100 flex flex-col">
      {/* Header */}
      <header className="border-b border-zinc-800 px-6 py-4 shrink-0">
        <div className="max-w-5xl mx-auto flex items-center gap-3">
          <span className="text-2xl">⚡</span>
          <div>
            <h1 className="text-xl font-bold tracking-tight">PostMortem AI</h1>
            <p className="text-xs text-zinc-500">
              Paste incident details. Get a production-ready postmortem in seconds.
            </p>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-6 py-10">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8 lg:items-start">
          {/* Form — left column */}
          <div className="lg:col-span-5">
            <IncidentForm onSubmit={handleGenerate} isGenerating={isStreaming} />
          </div>

          {/* Output — right column, sticky */}
          <div className="mt-8 lg:mt-0 lg:col-span-7 lg:sticky lg:top-6">
            <PostmortemOutput content={output} isStreaming={isStreaming} />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="shrink-0 border-t border-zinc-800 px-6 py-4 text-center text-xs text-zinc-600">
        Built with Claude Code &middot; Week 10 of 10 &middot;{" "}
        <a
          href="https://kanishksingh.vercel.app"
          target="_blank"
          rel="noopener noreferrer"
          className="text-zinc-500 hover:text-amber-400 transition-colors"
        >
          kanishksingh.vercel.app
        </a>
      </footer>
    </div>
  );
}
