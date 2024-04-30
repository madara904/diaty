import { cn } from "@/lib/utils";
import Link from "next/link";
import { buttonVariants } from "../ui/Button";



export default function NavBarCreds (){
    return(
    <>
    <div className="m-4">
    <Link href={"/sign-in"} className={cn(buttonVariants({variant: "violet"}), " hover:text-zinc-100")}>Sign in</Link>
    </div>
    </>
    );
    
}


{ /*         
<DropdownMenu>
    <DropdownMenuTrigger>
    <Avatar className="mr-8">
      <AvatarImage/>
      <AvatarFallback >BG</AvatarFallback>
    </Avatar>
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuLabel>My Account</DropdownMenuLabel>
    <DropdownMenuSeparator />
    <DropdownMenuItem onClick={quickLoginFC}>Sign out</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
*/}