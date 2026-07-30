import { AlertTriangle, CheckCircle2, Info, XCircle } from "lucide-react";
import type { Issue } from "@/lib/compatibility";
import { useLang } from "@/lib/i18n";

export function CompatibilityPanel({ issues }: { issues: Issue[] }) {
  const { lang, t } = useLang();

  if (issues.length === 0) {
    return (
      <div className="flex items-center gap-2 rounded-lg border border-[color-mix(in_oklab,var(--success)_50%,transparent)] bg-surface/60 px-4 py-3 text-sm">
        <CheckCircle2 className="size-4 text-success" />
        {t("noIssues")}
      </div>
    );
  }

  return (
    <ul className="space-y-2">
      {issues.map((issue, i) => {
        const Icon =
          issue.level === "error" ? XCircle : issue.level === "warning" ? AlertTriangle : Info;
        const color =
          issue.level === "error"
            ? "text-destructive"
            : issue.level === "warning"
              ? "text-warning"
              : "text-muted-foreground";
        return (
          <li
            key={i}
            className="flex items-start gap-2 rounded-lg border border-border bg-surface/60 px-4 py-3 text-sm"
          >
            <Icon className={`mt-0.5 size-4 shrink-0 ${color}`} />
            <span>{lang === "ar" ? issue.messageAr : issue.message}</span>
          </li>
        );
      })}
    </ul>
  );
}
