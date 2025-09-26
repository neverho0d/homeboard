export function makeCsp({ allowInline = true } = {}) {
  // Offline, no external connects. We allow inline <style> to keep single-file CSS.
  const script = allowInline ? "'self' 'unsafe-inline'" : "'self'";
  const style  = "'self'";
  return [
    "default-src 'none'",
    "img-src 'self' data:",
    `script-src ${script}`,
    `style-src ${style}`,
    "font-src 'self' data:",
    "connect-src 'none'",
    "frame-src 'none'",
    "object-src 'none'",
    "base-uri 'none'",
    "form-action 'none'",
    "frame-ancestors 'none'"
  ].join('; ');
}

