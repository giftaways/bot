export function parseTimeOffset(timeOffsetString: string): Date | null {
  const match = timeOffsetString.match(/^(\d+)([mhd])$/);

  if (!match) {
    return null;
  }

  const [, amount, unit] = match;
  const amountValue = parseInt(amount, 10);

  if (isNaN(amountValue)) {
    return null;
  }

  const now = new Date();

  switch (unit) {
    case "m":
      now.setMinutes(now.getMinutes() + amountValue);
      break;
    case "h":
      now.setHours(now.getHours() + amountValue);
      break;
    case "d":
      now.setDate(now.getDate() + amountValue);
      break;
    default:
      return null;
  }

  return now;
}
