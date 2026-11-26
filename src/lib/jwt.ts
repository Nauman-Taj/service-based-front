/**
 * Client-side JWT claim helpers.
 *
 * The signature is verified by the NestJS backend only. The browser decodes
 * claims solely to know when the access token should be refreshed.
 */

export interface TokenClaims {
  sub: string;
  email: string;
  role: string;
  name: string;
  typ: "access" | "refresh";
  iat: number;
  exp: number;
}

function base64UrlDecode(input: string): string {
  const base64 = input.replace(/-/g, "+").replace(/_/g, "/");
  const binary = atob(base64);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

export function decodeTokenClaims(token: string): TokenClaims | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) {
      return null;
    }
    const claims = JSON.parse(base64UrlDecode(parts[1])) as TokenClaims;
    return typeof claims.sub === "string" && typeof claims.exp === "number"
      ? claims
      : null;
  } catch {
    return null;
  }
}

export function isTokenExpired(token: string): boolean {
  const claims = decodeTokenClaims(token);
  return !claims || claims.exp * 1000 <= Date.now();
}
