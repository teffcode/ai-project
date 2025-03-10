import Link from "next/link";
import React from "react";

type ButtonProps = {
  variant?: "primary" | "secondary" | "tertiary";
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  href?: string;
};

const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  children,
  onClick,
  className = "",
  disabled = false,
  type = "button",
  href,
}) => {
  const baseStyles = "px-4 py-2 rounded-lg font-medium transition-all";
  const variants = {
    primary: "bg-orange-400 text-white hover:bg-orange-500",
    secondary: "bg-gray-200 text-gray-600 hover:bg-gray-300",
    tertiary: "text-gray-500 hover:text-gray-700",
  };

  const buttonContent = (
    <button
      type={type}
      className={`${baseStyles} ${variants[variant]} ${className} ${
        disabled ? "opacity-50 cursor-not-allowed hover:bg-none" : ""
      }`}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );

  return href ? <Link href={href}>{buttonContent}</Link> : buttonContent;
};

export default Button;
