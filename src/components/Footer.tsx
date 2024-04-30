import { HeartIcon } from "lucide-react"

const Footer = () => {
  return (
    <>
    <footer className=" flex flex-col mt-14 sm:-mt-14">
    <hr className="dark:border-gray-700 w-1/2 self-center"/>
      <div className="flex justify-center gap-1 text-xs font-bold h-12 items-center">
      <span>made with</span>
      <HeartIcon size={16} color="black" strokeWidth="1" fill="violet" />
      <span>in my crib :)</span>
      </div>
    </footer></>
  )
}

export default Footer