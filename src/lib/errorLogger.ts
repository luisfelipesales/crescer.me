/**
 * Centralized error logging utility
 * 
 * Security: In production, errors are not logged to console to prevent
 * information disclosure to attackers. Consider integrating with a 
 * server-side error monitoring service for production debugging.
 * 
 * Usage:
 * import { logError } from "@/lib/errorLogger";
 * logError("fetchData", error);
 */

export const logError = (context: string, error: unknown): void => {
  // Only log detailed errors in development
  if (import.meta.env.DEV) {
    console.error(`[${context}]`, error);
  }
  // In production, you could integrate with an error monitoring service:
  // if (import.meta.env.PROD) {
  //   errorMonitoringService.capture(error, { context });
  // }
};

export const logWarn = (context: string, message: string): void => {
  if (import.meta.env.DEV) {
    console.warn(`[${context}]`, message);
  }
};
