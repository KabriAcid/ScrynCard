// Utility to generate IDs
export const generateId = (prefix: string) =>
  `${prefix}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
