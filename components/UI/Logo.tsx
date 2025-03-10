import React from "react";

type LogoProps = {
  text?: string;
  className?: string;
};

const Logo: React.FC<LogoProps> = ({ text = "LOGO", className = "" }) => {
  return (
    <div className={`text-2xl font-bold ${className}`}>
      {text}
    </div>
  );
};

export default Logo;
