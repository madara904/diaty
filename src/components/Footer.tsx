import { Github, HeartIcon } from "lucide-react"
import Link from "next/link"

const Footer = () => {
  return (
    <>
    <footer className="flex flex-col mt-24 sm:-mt-14">
    <hr className="dark:border-gray-500 w-full self-center"/>
      <div className="flex justify-center text-xs font-bold h-12 items-center">
      <Link href={"https://github.com/madara904"}><Github size={30} color="" strokeWidth="1" fill="gray" className="mt-1 hover:opacity-80 cursor-pointer"/></Link>
      <span></span>
      </div>
    </footer>
    </>
  )
}

export default Footer
