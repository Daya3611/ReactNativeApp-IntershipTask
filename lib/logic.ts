// //prime
// export const isPrime = (n: number): boolean => {
//   if (n <= 2) return false;
//   for (let i = 2; i < n; i++) {
//     if (n % i === 0) return false;
//   }
//   return true;
// };

// // price
// export const calculatePrice = (title: string, description: string) => {
//     const vowel = description.match(/[aeiou]/gi) || [];
//     const price = title.length * 100 + vowel.length;
//     return `$${price.toFixed(2)}`;
// }