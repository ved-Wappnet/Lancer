// Utility helper functions for the app

/**
 * Returns a human-readable relative time string (e.g., "2h ago") for a given date.
 * @param date string | Date
 */


export function timeAgo(date: string | Date): string {
  const now = new Date();
  const d = typeof date === 'string' ? new Date(date) : date;
  const diff = Math.floor((now.getTime() - d.getTime()) / 1000); // seconds
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 2592000) return `${Math.floor(diff / 86400)}d ago`;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

/**
 * Format a number or string as USD currency (e.g., $1,234.00)
 */
export function usdFormat(amount: number | string | undefined | null): string {
  if (amount === undefined || amount === null) return '-';
  // Always treat as string for cleaning
  const cleaned = String(amount).replace(/[^0-9.-]+/g, '').trim();
  console.log('usdFormat input:', JSON.stringify(amount), 'cleaned:', JSON.stringify(cleaned));
  const num = Number(cleaned);
  if (isNaN(num)) return '-';
  return `$${num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}
