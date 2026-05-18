"use client";

import { useEffect, useRef } from "react";

interface Props {
  content: string;
  isStreaming: boolean;
}

export function PostmortemOutput({ content, isStreaming }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isStreaming && ref.current) {
      ref.current.scrollTop = ref.current.scrollHeight;
    }
  }, [content, isStreaming]);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
  };

  const handleDownload = () => {
    const blob = new Blob([content], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "postmortem.md";
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!content && !isStreaming) return null;

  return (
    <div className="border border-amber-500/30 rounded-lg overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 bg-amber-500/10 border-b border-amber-500/30">
        <div className="flex items-center gap-3">
          <span className="text-amber-400 text-sm font-mono font-semibold tracking-widest uppercase">
            Generated Postmortem
          </span>
          {content && !isStreaming && (
            <span className="inline-flex items-center gap-1 bg-green-500/10 text-green-400 border border-green-500/30 px-2 py-0.5 rounded text-xs font-mono">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-400" />
              Generation complete
            </span>
          )}
        </div>
        {content && !isStreaming && (
          <div className="flex gap-2">
            <button
              onClick={handleCopy}
              className="text-xs px-3 py-1 rounded border border-zinc-700 text-zinc-400 hover:text-zinc-200 hover:border-zinc-500 transition-colors"
            >
              Copy Markdown
            </button>
            <button
              onClick={handleDownload}
              className="text-xs px-3 py-1 rounded border border-amber-600 text-amber-400 hover:bg-amber-500/20 transition-colors"
            >
              Download .md
            </button>
          </div>
        )}
        {isStreaming && (
          <span className="text-xs text-zinc-500 font-mono animate-pulse">generating...</span>
        )}
      </div>
      <div
        ref={ref}
        className="p-5 max-h-[600px] overflow-y-auto bg-black"
      >
        <pre className="font-mono text-sm text-zinc-300 whitespace-pre-wrap leading-relaxed">
          {content}
          {isStreaming && <span className="inline-block w-2 h-4 bg-amber-400 animate-pulse ml-0.5 align-middle" />}
        </pre>
      </div>
    </div>
  );
}
