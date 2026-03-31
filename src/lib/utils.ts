export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(" ");
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + "...";
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

export function getMatchColor(level: string | null): string {
  switch (level) {
    case "strong":
      return "var(--color-score-high)";
    case "moderate":
      return "var(--color-score-medium)";
    case "weak":
      return "var(--color-score-low)";
    default:
      return "var(--color-score-neutral)";
  }
}

export function getMatchLabel(score: number): "strong" | "moderate" | "weak" {
  if (score >= 80) return "strong";
  if (score >= 60) return "moderate";
  return "weak";
}
