import { FC, ReactNode } from "react";

interface BodySectionProps {
  children: ReactNode;
}

const BodySection: FC<BodySectionProps> = ({ children }) => {
  return <section className="border-t border-gray-100 mt-12 md:mt-0 py-12 mx-8">{children}</section>;
};

export default BodySection;
