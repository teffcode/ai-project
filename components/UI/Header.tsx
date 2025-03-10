import React from "react";
import { usePathname } from "next/navigation";
import Logo from "@/components/UI/Logo";
import Button from "@/components/UI/Button";

const Header: React.FC = () => {
  const pathname = usePathname();
  const isSearchView = pathname === "/search";

  return (
    <header className="w-full h-[60px] border-b border-gray-200 bg-white">
      <div className="max-w-7xl mx-auto flex items-center justify-between h-full px-4">
        <Logo text="🍜 ChowMates" className="text-xl font-semibold" />

        <div className="flex gap-4">
          <Button variant="tertiary" href="/login">Login</Button>
          <Button variant="secondary" href={isSearchView ? "/upload" : "/search"}>
            {isSearchView ? "Upload" : "Search"}
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
