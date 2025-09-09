const StarRating = ({
  rating,
  totalRatings,
}: {
  rating: number;
  totalRatings: number;
}) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;

  for (let i = 0; i < 5; i++) {
    if (i < fullStars) {
      stars.push(<i key={i} className="bi bi-star-fill "></i>);
    } else if (i === fullStars && hasHalfStar) {
      stars.push(<i key={i} className="bi bi-star-half "></i>);
    } else {
      stars.push(<i key={i} className="bi bi-star"></i>);
    }
  }

  return (
    <div className="flex items-center gap-1">
      <div className="meta-review">{stars}</div>
      {/* <span className="text-xs text-white ml-1 font-medium">
        {rating > 0 ? rating.toFixed(1) : "5.0"}{" "}
        {totalRatings > 0 && `(${totalRatings})`}
      </span> */}
    </div>
  );
};

export default StarRating;
