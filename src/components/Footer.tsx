import { Github, HeartIcon } from "lucide-react"
import Link from "next/link"

const Footer = () => {
  return (
    <>
    <footer className="flex flex-col mt-12 sm:mt-0 bg-gray-800">
    <hr className="dark:border-gray-1 w-full self-center"/>
      <div className="flex justify-center text-xs font-bold h-14 items-center">
      <Link href={"https://github.com/madara904"}><Github size={30} color="" strokeWidth="1" fill="white" className="mt-1 hover:opacity-80 cursor-pointer"/></Link>
      <span></span>
      </div>
    </footer>
    </>
  )
}

export default Footer