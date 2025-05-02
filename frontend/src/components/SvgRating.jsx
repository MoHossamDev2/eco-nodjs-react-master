export default function SvgRating({ value, max = 5 }) {
  const fullStars = Math.floor(value);
  const fraction = value - fullStars;

  return (
    <div
      style={{
        display: "flex",
        gap: "4px",
        marginBottom: "8px",
        justifyContent: "center",
      }}
      aria-label={`Rating: ${value} out of ${max}`}
    >
      {Array.from({ length: max }, (_, index) => {
        const isFull = index < fullStars;
        const isPartial = index === fullStars && fraction > 0;

        return (
          <div
            key={index}
            style={{
              position: "relative",
              width: "24px",
              height: "24px",
            }}
          >
            {/* Gray (Empty) Star */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              style={{
                width: "100%",
                height: "100%",
                fill: "#ccc",
                stroke: "black",
                strokeWidth: "1px",
                position: "absolute",
                top: 0,
                left: 0,
              }}
            >
              <path d="M12 17.27L18.18 21 15.54 13.97 22 9.24 14.81 8.63 12 2 9.19 8.63 2 9.24 8.46 13.97 5.82 21z" />
            </svg>

            {/* Gold (Filled) Star */}
            {(isFull || isPartial) && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                style={{
                  width: "100%",
                  height: "100%",
                  fill: "gold",
                  stroke: "black",
                  strokeWidth: "1px",
                  position: "absolute",
                  top: 0,
                  left: 0,
                  clipPath: isPartial
                    ? `polygon(0 0, ${fraction * 100}% 0, ${
                        fraction * 100
                      }% 100%, 0 100%)`
                    : "none",
                }}
              >
                <path d="M12 17.27L18.18 21 15.54 13.97 22 9.24 14.81 8.63 12 2 9.19 8.63 2 9.24 8.46 13.97 5.82 21z" />
              </svg>
            )}
          </div>
        );
      })}
    </div>
  );
}
