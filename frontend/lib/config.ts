/**
 * Frontend configuration — reads from environment variables.
 *
 * Only NEXT_PUBLIC_ prefixed variables are available in the browser.
 * AWS credentials must NEVER appear here. See CLAUDE.md §19.
 */
export const config = {
  apiUrl: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000',
} as const
