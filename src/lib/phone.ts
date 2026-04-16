export function toTelHref(display: string): string {
  const digits = display.replace(/\s+/g, "");
  if (digits.startsWith("0")) {
    return `+33${digits.slice(1)}`;
  }
  return digits.startsWith("+") ? digits : `+${digits}`;
}
