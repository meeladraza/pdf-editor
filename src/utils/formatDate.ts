export const formatDate = (dateValue: any): string => {
  if (!dateValue) return '';

  if (typeof dateValue === 'string' && /^\d{2}-[A-Z]{3}-\d{4}$/.test(dateValue)) {
    return dateValue;
  }

  let date: Date;

  if (typeof dateValue === 'number' && dateValue > 25568) {
    const excelEpoch = new Date(1899, 11, 30);
    date = new Date(excelEpoch.getTime() + dateValue * 86400 * 1000);
  }
  else if (typeof dateValue === 'string') {
    date = new Date(dateValue);
    if (isNaN(date.getTime())) {
      date = new Date(dateValue.replace(/(\d+)\/(\d+)\/(\d+)/, '$2/$1/$3'));
    }
  }
  else if (dateValue instanceof Date) {
    date = dateValue;
  }
  else {
    return String(dateValue);
  }

  if (isNaN(date.getTime())) {
    return String(dateValue);
  }

  const day = date.getDate().toString().padStart(2, '0');
  const monthNames = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear();

  return `${day}-${month}-${year}`;
};
