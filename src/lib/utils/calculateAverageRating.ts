export const calculateAverageRating = (reviews?: Array<{ rating: number }>) => {
  if (!reviews || !Array.isArray(reviews) || reviews.length === 0) {
    return 0;
  }

  const sum = reviews.reduce((total, review) => total + (review.rating || 0), 0);
  const average = sum / reviews.length;
  return Math.round(average * 10) / 10;
};
