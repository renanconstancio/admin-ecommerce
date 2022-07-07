export function price(price: string) {
  if (price === '') return '0,00';
  const options = { minimumFractionDigits: 2 };
  const result = new Intl.NumberFormat('pt-BR', options).format(
    parseFloat(price) / 100,
  );
  return result;
}
