export const formatDate = (dateValue: any): string => {
  if (!dateValue) return '';
  
  // If it's already in the correct format, return as is
  if (typeof dateValue === 'string' && /^\d{2}-[A-Z]{3}-\d{4}$/.test(dateValue)) {
    return dateValue;
  }
  
  let date: Date;
  
  // Handle Excel serial date numbers
  if (typeof dateValue === 'number' && dateValue > 25568) { // Excel dates start from 1900-01-01
    // Excel date numbers are days since January 1, 1900
    // Adjust for Excel's leap year bug (Excel thinks 1900 was a leap year)
    const excelEpoch = new Date(1899, 11, 30); // December 30, 1899
    date = new Date(excelEpoch.getTime() + dateValue * 86400 * 1000);
  }
  // Try parsing as a date string
  else if (typeof dateValue === 'string') {
    date = new Date(dateValue);
    // If that fails, try common date formats
    if (isNaN(date.getTime())) {
      // Try MM/DD/YYYY format (common in US Excel)
      date = new Date(dateValue.replace(/(\d+)\/(\d+)\/(\d+)/, '$2/$1/$3'));
    }
  }
  // If it's already a Date object
  else if (dateValue instanceof Date) {
    date = dateValue;
  }
  else {
    return String(dateValue);
  }
  
  // Check if the date is valid
  if (isNaN(date.getTime())) {
    return String(dateValue);
  }
  
  // Format as "02-OCT-2025"
  const day = date.getDate().toString().padStart(2, '0');
  const monthNames = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear();
  
  return `${day}-${month}-${year}`;
};