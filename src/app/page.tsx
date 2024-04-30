import { Button, buttonVariants } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { Activity, Apple, Droplet, DropletIcon } from "lucide-react";
import Link from "next/link";

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
    <div className="mt-10 text-center relative">
      <h1 className="text-7xl md:text-7xl -z-10 relative text-balance">Discover   
      <span className="before:block before:absolute before:-inset-2 before:translate-x-4 before:bg-violet-500 before:w-40 relative inline-block z-0">
    <span className="relative text-primary">diaty</span>
  </span> and start your healthy journey today!</h1>

      <div className="sm:flex pt-28 md:justify-between font-medium text-start">
      {perks.map((perk) => 
      <div key={perk.description}
      className="flex sm:min-w-[350px] md:min-w-0"
      >
        {<perk.Icon.img className={cn("mr-3 mb-5", perk.Icon.color)} />}
      <div>{perk.description}</div>
      </div>)}
  
      </div>
      <div className="mt-24">
      <div className='flex flex-col sm:flex-row sm:justify-center gap-4'>
            <Link
              href='/sign-in'
              className={cn(buttonVariants(), "font-semibold")}>
              Get Started
            </Link>
            <Button variant='ghost'>
              Browse Foods &rarr;
            </Button>
          </div>
      </div>
    </div>
  );
}
