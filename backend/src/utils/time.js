export function calculateHours(checkIn, checkOut) {
  if (!checkIn || !checkOut) return 0;
  
  const [inHour, inMinute] = checkIn.split(':').map(Number);
  const [outHour, outMinute] = checkOut.split(':').map(Number);
  
  if (isNaN(inHour) || isNaN(inMinute) || isNaN(outHour) || isNaN(outMinute)) return 0;
  
  let inMinutes = inHour * 60 + inMinute;
  let outMinutes = outHour * 60 + outMinute;
  
  // Handle cross-day shift (e.g., night shifts)
  if (outMinutes < inMinutes) {
    outMinutes += 24 * 60; // add a day
  }
  
  const diffMinutes = outMinutes - inMinutes;
  return parseFloat((diffMinutes / 60).toFixed(2));
}
