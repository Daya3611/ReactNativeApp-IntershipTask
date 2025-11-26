export const isPrime = (num: number): boolean => {
  if (num <= 1) return false;
  if (num <= 3) return true;
  if (num % 2 === 0 || num % 3 === 0) return false;
  let i = 5;
  while (i * i <= num) {
    if (num % i === 0 || num % (i + 2) === 0) return false;
    i += 6;
  }
  return true;
};

export const calculatePrice = (title: string, description: string): string => {
  const titleLength = title.length;
  const vowels = description.match(/[aeiou]/gi);
  const vowelCount = vowels ? vowels.length : 0;
  const price = titleLength * 10 + vowelCount;
  return `$${price.toFixed(2)}`;
};
