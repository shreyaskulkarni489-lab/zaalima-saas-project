export const formatPrice = (price) => {
  return `₹${Number(price || 0).toLocaleString()}`;
};
