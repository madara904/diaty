import { Github } from "lucide-react";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="flex flex-col bg-gray-800 w-full">
      <hr className="border-gray-700 w-full" />
      <div className="flex justify-center text-xs font-bold h-14 items-center">
        <Link href="https://github.com/madara904" aria-label="GitHub">
          <Github
            size={30}
            strokeWidth="1"
            fill="white"
            className="hover:opacity-80 cursor-pointer"
          />
        </Link>
      </div>
    </footer>
  );
};

export default Footer;
