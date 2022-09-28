export const slugiFy = (string: string): string => {
  return string
    .trim()
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036F]/g, '')
    .replace(/ /g, '-')
    .replace(/[^\w-]+/g, '');
};
