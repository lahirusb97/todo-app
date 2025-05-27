export function getErrorMessage(err: unknown, fallback = "An error occurred") {
  return err instanceof Error
    ? err.message
    : typeof err === "string"
    ? err
    : fallback;
}

// Usage:
