export function cleanRut(rut: string): string {
  // Remove dots, dashes and spaces, and convert to uppercase
  return rut.replace(/[^0-9kK]/g, '').toUpperCase();
}

export function formatRut(rut: string): string {
  const cleaned = cleanRut(rut);
  if (cleaned.length < 2) return cleaned;
  
  const dv = cleaned.slice(-1);
  const numbers = cleaned.slice(0, -1);
  const formatted = numbers.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  
  return `${formatted}-${dv}`;
}

export function validateRut(rut: string): boolean {
  // Basic format validation
  if (!/^0*(\d{1,3}(\.?\d{3})*)-?([\dkK])$/.test(rut)) return false;

  const cleaned = cleanRut(rut);
  
  // Check length (7 to 9 digits + verification digit)
  if (cleaned.length < 8 || cleaned.length > 10) return false;

  const dv = cleaned.slice(-1);
  const numbers = cleaned.slice(0, -1);
  
  // Calculate verification digit
  let sum = 0;
  let multiplier = 2;

  // Iterate from right to left
  for (let i = numbers.length - 1; i >= 0; i--) {
    sum += parseInt(numbers[i]) * multiplier;
    multiplier = multiplier === 7 ? 2 : multiplier + 1;
  }

  const expectedDv = 11 - (sum % 11);
  let calculatedDv: string;

  if (expectedDv === 11) calculatedDv = '0';
  else if (expectedDv === 10) calculatedDv = 'K';
  else calculatedDv = expectedDv.toString();

  return calculatedDv === dv.toUpperCase();
}