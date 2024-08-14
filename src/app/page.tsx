
import { cn } from "@/lib/utils";
import { Activity, Apple, DropletIcon } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/Button";
import { inter } from "@/components/(Navbar)/NavBar";

const perks = [
  {
    Icon: {
      img: Activity,
      color: "text-blue-600"
    },
    description:
      'The easy way to track your daily intakes',
  },
  {
    Icon: {
      img: Apple,
      color: "text-green-600"
    },
    description:
      'Eat healthier for better vitals',
  },
  {
    Icon: {
      img: DropletIcon,
      color: "text-red-600"},
    description:
      "Appropriate calculations for your diabetical portions",
  },
]

export default function Home() {
  return (
    <div className="mt-5 text-center">
      <h1 className="text-7xl md:text-8xl relative text-balance font-serif"><span>Discover </span>   
      <span className="before:block before:absolute before:-inset-1 before:translate-x-4 before:bg-gray-600 before:w-40 relative inline-block z-0">
    <span className={cn("relative text-primary", inter.className)}> diaty</span>
    </span> and start your healthy journey today!
    </h1>

      <div className="sm:flex mt-20 font-normal text-start justify-between">
      {perks.map((perk) => 
      <div key={perk.description}
      className="flex"
      >
        {<perk.Icon.img className={cn("min-w-6 min-h-6", perk.Icon.color)} />}
      <div className="ml-3 mb-5">{perk.description}</div>
      </div>)}
  
      </div>
      <div className="mt-10 md:mt-28">
      <div className='flex flex-col sm:flex-row sm:justify-center gap-4'>
            <Link
              href='/sign-in'
              className={cn(buttonVariants(), "font-normal")}>
              Get Started
            </Link>
            <Link href='/dashboard'
              className={cn(buttonVariants({variant: "ghost"}), "font-normal")}>
              Browse Foods &rarr;
            </Link>
          </div>
      </div>
    </div>
  );
}
