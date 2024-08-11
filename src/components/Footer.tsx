import { Github, HeartIcon } from "lucide-react"

const Footer = () => {
  return (
    <>
    <footer className="flex flex-col mt-15 sm:-mt-14">
    <hr className="dark:border-gray-700 w-full self-center"/>
      <div className="flex justify-center text-xs font-bold h-12 items-center">
      <Github size={30} color="" strokeWidth="1" fill="gray" className="mt-1 hover:opacity-80 cursor-pointer"/>
      <span></span>
      </div>
    </footer>
    </>
  )
}

export default Footer