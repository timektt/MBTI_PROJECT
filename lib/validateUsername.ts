export function validateUsername(username: string): string | null {
    if (!/^[a-z0-9_]{3,20}$/.test(username)) {
      return "Username must be 3–20 characters: a-z, 0-9, and _ only.";
    }
    return null;
  }
  