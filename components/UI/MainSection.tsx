import Image from "next/image";
import { FC, ReactNode } from "react";

interface MainSectionProps {
  title: string;
  highlight: string;
  description: string;
  imageSrc: string;
  children?: ReactNode;
}

const MainSection: FC<MainSectionProps> = ({ title, highlight, description, imageSrc, children }) => {
  return (
    <section className="max-w-5xl w-full flex flex-col md:flex-row items-center px-8">
      <div className="flex-[2] mt-12 md:mt-24 mb-0 md:mb-24 mr-0 md:mr-24">
        <h1 className="text-4xl md:text-5xl font-bold mb-12">
          {title.split(highlight)[0]}
          <span className="text-orange-400">{highlight}</span>
          {title.split(highlight)[1]}
        </h1>
        <p className="text-lg text-gray-500 mb-2">{description}</p>
        {children && <div>{children}</div>}
      </div>
      <div className="flex-1 relative hidden md:flex">
        <Image
          src={imageSrc}
          alt="Main section image"
          className="w-full h-[400px] object-cover rounded-xl border-4 border-orange-200"
          width={100}
          height={100}
          unoptimized
        />
      </div>
    </section>
  );
};

export default MainSection;
