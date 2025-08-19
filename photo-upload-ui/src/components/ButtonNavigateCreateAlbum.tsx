import { useNavigate } from "react-router";

interface ButtonNavigateCreateAlbumProps {
  show?: boolean;
  variant?: "floating" | "regular";
  className?: string;
  children?: React.ReactNode;
}

export function ButtonNavigateCreateAlbum({
  show = true,
  variant,
  className = "",
  children,
}: ButtonNavigateCreateAlbumProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/albums/create");
  };

  if (variant === "regular") {
    return (
      <button className={`btn btn-primary ${className}`} onClick={handleClick}>
        {children || "Create Album"}
      </button>
    );
  }

  if (!show) {
    return null;
  }

  return (
    <button
      className={`btn btn-primary btn-circle fixed bottom-6 right-6 z-50 shadow-lg ${className}`}
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
