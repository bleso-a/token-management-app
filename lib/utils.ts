export function formatAddress(address: string): string {
  if (!address) return "";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function formatAmount(amount: string): string {
  const parsedAmount = parseFloat(amount);
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 }).format(
    parsedAmount
  );
}

export async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function isValidAddress(address: string): boolean {
  // Basic Ethereum address validation
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

export function isValidAmount(amount: string): boolean {
  const parsedAmount = parseFloat(amount);
  return !isNaN(parsedAmount) && parsedAmount > 0;
}
