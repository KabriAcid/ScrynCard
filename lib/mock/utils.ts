// Utility to generate stable IDs using a counter
let idCounters: Record<string, number> = {};

export const generateId = (prefix: string) => {
  if (!idCounters[prefix]) {
    idCounters[prefix] = 1;
  }
  const id = `${prefix}-${idCounters[prefix].toString().padStart(6, "0")}`;
  idCounters[prefix]++;
  return id;
};

// Reset counters (useful for tests)
export const resetIdCounters = () => {
  idCounters = {};
};
