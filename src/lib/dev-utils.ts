/**
 * Utility to simulate network delay for development/testing
 * This helps visualize loading states that would appear on slow networks
 */

export async function simulateDelay(ms: number = 800) {
  // Only add delay in development to test loading states
  if (process.env.NODE_ENV === "development") {
    await new Promise((resolve) => setTimeout(resolve, ms));
  }
}

/**
 * Use this in Server Components to test loading states:
 *
 * async function MyComponent() {
 *   await simulateDelay(1000); // Simulate 1s network delay
 *   const data = await fetchData();
 *   return <div>{data}</div>
 * }
 */
