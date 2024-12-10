export function validateChileanPhone(phone: string): boolean {
    const phoneRegex = /^\+569\d{8}$/;
    return phoneRegex.test(phone);
  }
  
  export function formatChileanPhone(phone: string): string {
    // Remove all non-digit characters except '+'
    const cleaned = phone.replace(/[^\d+]/g, '');
    
    // If it doesn't start with '+', add it
    if (!cleaned.startsWith('+')) {
      return '+' + cleaned;
    }
    
    return cleaned;
  }