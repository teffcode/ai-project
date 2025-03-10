import { FC } from "react";

interface SectionHeaderProps {
  title: string;
  description: string;
  highlight: string;
}

const SectionHeader: FC<SectionHeaderProps> = ({ title, description, highlight }) => {
  const parts = title.split(highlight);

  return (
    <div className="mb-8">
      <p className="text-sm uppercase text-gray-500 mb-2">{description}</p>
      <h2 className="text-2xl font-bold">
        {parts[0]}
        <span className="text-orange-400">{highlight}</span>
        {parts[1]}
      </h2>
    </div>
  );
};

export default SectionHeader;
