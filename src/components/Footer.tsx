import { Github, HeartIcon } from "lucide-react"
import Link from "next/link"

const Footer = () => {
  return (
    <>
    <footer className="pt-8 sm:pt-20 sm:-mt-32">
    <hr className="dark:border-gray-700 self-center"/>
      <div className="flex justify-center text-xs font-bold items-center">
      <Link href={"https://github.com/madara904"}><Github size={30} color="" strokeWidth="1" fill="gray" className="mt-1 sm:mt-3 hover:opacity-80 cursor-pointer"/></Link>
      <span></span>
      </div>
    </footer>
    </>
  )
}

export default Footer

