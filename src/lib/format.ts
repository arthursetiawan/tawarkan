export function formatIDR(value: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatCompactIDR(value: number): string {
  if (value >= 1_000_000) {
    const jt = value / 1_000_000;
    return `Rp${jt % 1 === 0 ? jt.toFixed(0) : jt.toFixed(1)}jt`;
  }
  return formatIDR(value);
}
