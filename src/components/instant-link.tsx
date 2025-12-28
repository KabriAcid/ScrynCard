import { useNavigate } from "react-router-dom";
import { ComponentProps, MouseEvent, ReactNode } from "react";

type InstantLinkProps = Omit<ComponentProps<"button">, "onClick"> & {
  to?: string;
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
  children?: ReactNode;
};

/**
 * A Link component that navigates using React Router instead of Next.js.
 */
export function InstantLink({
  to = "/",
  onClick,
  className = "",
  children,
  ...props
}: InstantLinkProps) {
  const navigate = useNavigate();

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    // Call custom onClick if provided
    if (onClick) {
      onClick(e);
    }

    // If default was prevented, don't navigate
    if (e.defaultPrevented) {
      return;
    }

    // Navigate to the specified path
    navigate(to);

    // Dispatch navigation start event for progress bar
    window.dispatchEvent(new Event("navigationStart"));
  };

  return (
    <button
      {...props}
      className={`text-blue-600 hover:underline ${className}`}
      onClick={handleClick}
    >
      {children}
    </button>
  );
}
