// This file helps TypeScript understand the path aliases

declare module '@/lib/utils' {
  export function cn(...inputs: any[]): string;
  export const isBrowser: boolean;
  export function getBaseUrl(): string;
  export function getErrorMessage(error: unknown): string;
}

declare module '@/*' {
  const value: any;
  export default value;
}
