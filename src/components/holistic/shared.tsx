"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { DOSHA_COLORS } from "@/lib/store";
import { cn } from "@/lib/utils";

/* ---------------- Dosha donut (Prakriti / Vikriti results) ---------------- */

/** Small visual anchors: one glyph per dosha, used sparingly across the app. */
export const DOSHA_SYMBOLS: Record<"vata" | "pitta" | "kapha", string> = {
  vata: "💨",
  pitta: "🔥",
  kapha: "💧",
};

export function DoshaDonut({
  vata,
  pitta,
  kapha,
  centerLabel,
  centerSub,
  size = 220,
}: {
  vata: number;
  pitta: number;
  kapha: number;
  centerLabel?: string;
  centerSub?: string;
  size?: number;
}) {
  const data = [
    { name: "Vata", value: vata, color: DOSHA_COLORS.vata },
    { name: "Pitta", value: pitta, color: DOSHA_COLORS.pitta },
    { name: "Kapha", value: kapha, color: DOSHA_COLORS.kapha },
  ];
  // Scale the center text so long labels (e.g. "Balanced (Tridosha)") stay
  // inside the donut hole instead of spilling over the ring.
  const labelSize = !centerLabel
    ? ""
    : centerLabel.length <= 8
      ? "text-2xl"
      : centerLabel.length <= 12
        ? "text-base"
        : "text-sm";
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius="68%"
            outerRadius="96%"
            startAngle={90}
            endAngle={-270}
            strokeWidth={2}
            stroke="#fff"
          >
            {data.map((d) => (
              <Cell key={d.name} fill={d.color} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number | string, name: string) => [`${Number(value).toFixed(1)}%`, name]}
            contentStyle={{ borderRadius: 12, border: "1px solid var(--border)", fontSize: 13 }}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-[14%] text-center leading-tight">
        {centerLabel && (
          <span className={cn("font-semibold tracking-tight break-words hyphens-auto", labelSize)}>{centerLabel}</span>
        )}
        {centerSub && <span className="mt-0.5 text-[11px] leading-tight text-muted-foreground">{centerSub}</span>}
      </div>
    </div>
  );
}

export function DoshaLegend({
  vata,
  pitta,
  kapha,
}: {
  vata: number | string;
  pitta: number | string;
  kapha: number | string;
}) {
  const rows = [
    { name: "Vata", value: vata, color: DOSHA_COLORS.vata },
    { name: "Pitta", value: pitta, color: DOSHA_COLORS.pitta },
    { name: "Kapha", value: kapha, color: DOSHA_COLORS.kapha },
  ];
  return (
    <div className="flex flex-col gap-2.5">
      {rows.map((r) => (
        <div key={r.name} className="flex items-center gap-2.5">
          <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ background: r.color }} />
          <span className="text-sm font-medium">
            {DOSHA_SYMBOLS[r.name.toLowerCase() as keyof typeof DOSHA_SYMBOLS]} {r.name}
          </span>
          <span className="ml-auto text-sm tabular-nums text-muted-foreground">{r.value}%</span>
        </div>
      ))}
    </div>
  );
}

/* ------------- Horizontal stacked dosha bar (dashboard snapshot) ------------- */

export function DoshaStackBar({ vata, pitta, kapha }: { vata: number; pitta: number; kapha: number }) {
  const total = Math.max(vata + pitta + kapha, 0.0001);
  // Bar widths are proportional shares; the LABELS show the raw (absolute-basis)
  // percentages passed in, which need not sum to 100.
  const seg = [
    { name: "Vata", pct: (vata / total) * 100, value: vata, color: DOSHA_COLORS.vata },
    { name: "Pitta", pct: (pitta / total) * 100, value: pitta, color: DOSHA_COLORS.pitta },
    { name: "Kapha", pct: (kapha / total) * 100, value: kapha, color: DOSHA_COLORS.kapha },
  ];
  return (
    <div>
      <div className="flex h-3.5 w-full overflow-hidden rounded-full bg-muted">
        {seg.map((s) => (
          <div key={s.name} style={{ width: `${s.pct}%`, background: s.color }} className="h-full first:rounded-l-full last:rounded-r-full transition-all" />
        ))}
      </div>
      <div className="mt-2 flex justify-between text-xs">
        {seg.map((s) => (
          <span key={s.name} className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full" style={{ background: s.color }} />
            <span className="font-medium">
              {DOSHA_SYMBOLS[s.name.toLowerCase() as keyof typeof DOSHA_SYMBOLS]} {s.name}
            </span>
            <span className="text-muted-foreground tabular-nums" title="Absolute-basis percentage (obtained ÷ that dosha's maximum)">
              {Math.round(s.value * 10) / 10}%
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}

/* ---------------- Evidence badge ---------------- */

const EVIDENCE_META: Record<string, { label: string; title: string; className: string }> = {
  DR: {
    label: "Research finding",
    title: "Quantitative result reported in a peer-reviewed paper.",
    className: "bg-sky-100 text-sky-800 border-sky-200 dark:bg-sky-950 dark:text-sky-300 dark:border-sky-900",
  },
  AI: {
    label: "Author interpretation",
    title: "The authors' interpretation of their data, without a direct statistical demonstration.",
    className: "bg-violet-100 text-violet-800 border-violet-200 dark:bg-violet-950 dark:text-violet-300 dark:border-violet-900",
  },
  CT: {
    label: "Classical / traditional",
    title: "Grounded in classical Ayurvedic texts via reviewed modern sources.",
    className: "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-900",
  },
  DP: {
    label: "Experimental rule",
    title: "Platform design proposal with no direct empirical source.",
    className: "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-900",
  },
};

export function EvidenceBadge({ level, className }: { level: string; className?: string }) {
  const meta = EVIDENCE_META[level] ?? EVIDENCE_META.DP;
  return (
    <span
      title={meta.title}
      className={cn(
        "inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium whitespace-nowrap",
        meta.className,
        className
      )}
    >
      {meta.label}
    </span>
  );
}

export function ProvenanceBadge({ provenance }: { provenance: string }) {
  const map: Record<string, { label: string; className: string }> = {
    measured: { label: "Device reading", className: "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-900" },
    manual: { label: "Manually entered", className: "bg-sky-100 text-sky-800 border-sky-200 dark:bg-sky-950 dark:text-sky-300 dark:border-sky-900" },
    estimated: { label: "Estimated", className: "bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-950 dark:text-orange-300 dark:border-orange-900" },
  };
  const meta = map[provenance] ?? { label: provenance, className: "bg-muted text-muted-foreground border-border" };
  return (
    <span className={cn("inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium whitespace-nowrap", meta.className)}>
      {meta.label}
    </span>
  );
}

/* ---------------- Cards & states ---------------- */

export function Panel({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn("rounded-xl border bg-card p-6", className)}>{children}</div>;
}

export function EmptyState({ title, body, action }: { title: string; body: string; action?: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed bg-card/50 px-6 py-14 text-center">
      <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-accent text-primary">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" opacity="0.15" />
          <path d="M12 16v-4M12 8h.01" />
        </svg>
      </div>
      <h3 className="text-base font-semibold">{title}</h3>
      <p className="mt-1 max-w-md text-sm text-muted-foreground">{body}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function Spinner({ label }: { label?: string }) {
  return (
    <div className="flex items-center justify-center gap-3 py-16 text-muted-foreground" role="status" aria-live="polite">
      <span className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      {label && <span className="text-sm">{label}</span>}
    </div>
  );
}

export function Callout({ tone = "info", title, children }: { tone?: "info" | "warn" | "success"; title?: string; children: React.ReactNode }) {
  const tones = {
    info: "border-sky-200 bg-sky-50 text-sky-900 dark:border-sky-900 dark:bg-sky-950/50 dark:text-sky-200",
    warn: "border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900 dark:bg-amber-950/50 dark:text-amber-200",
    success: "border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-900 dark:bg-emerald-950/50 dark:text-emerald-200",
  };
  return (
    <div className={cn("rounded-lg border px-4 py-3 text-sm leading-relaxed", tones[tone])} role="note">
      {title && <p className="font-semibold mb-0.5">{title}</p>}
      {children}
    </div>
  );
}
