export const ITEMS_PER_PAGE = 10;

export function discountedPrice(item) {
  return Math.round(item.price * (1 - item.discountPercentage / 100), 2);
}

// {Math.round(
//     product.price * (1 - product.discountPercentage / 100)
//   )}

// The last 2 is round(x: number): number
// Returns a supplied numeric expression rounded to the nearest integer.
