"use client";

import { Panel } from "@/components/holistic/shared";
import { PLATFORM_REFERENCES } from "@/lib/data/knowledge-base";

export default function AboutScreen() {
  return (
    <div className="animate-fade-up mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">References</h1>
      </div>

      <Panel className="p-0">
        <div className="border-b px-6 py-4"><h2 className="font-semibold">Research references used</h2></div>
        <ol className="holistic-scroll max-h-96 space-y-3 overflow-y-auto px-6 py-5 text-xs leading-relaxed">
          {PLATFORM_REFERENCES.map((r) => (
            <li key={r.id} className="flex gap-2.5">
              <span className="font-mono text-muted-foreground">[{r.id}]</span>
              <span>
                {r.citation}{" "}
                {r.url && (
                  <a href={r.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                    {r.url.replace(/^https?:\/\//, "").slice(0, 60)}
                  </a>
                )}
                <span className="mt-1 block rounded-md bg-muted/60 px-2 py-1 text-[11px] text-muted-foreground">{r.usedFor}</span>
              </span>
            </li>
          ))}
        </ol>
      </Panel>
    </div>
  );
}
