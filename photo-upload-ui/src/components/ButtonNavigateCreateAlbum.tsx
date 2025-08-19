import { useNavigate } from "react-router";

interface ButtonNavigateCreateAlbumProps {
  variant?: "floating" | "regular";
  className?: string;
  children?: React.ReactNode;
}

export function ButtonNavigateCreateAlbum({
  variant = "regular",
  className = "",
  children,
}: ButtonNavigateCreateAlbumProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/albums/create");
  };

  if (variant === "floating") {
    return (
      <button
        className={`btn btn-secondary btn-circle fixed bottom-20 right-6 z-50 shadow-lg ${className}`}
        onClick={handleClick}
        aria-label="Create new album"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4v16m8-8H4"
          />
        </svg>
      </button>
    );
  }

  return (
    <button className={`btn btn-secondary ${className}`} onClick={handleClick}>
      {children || "Create Album"}
    </button>
  );
}
