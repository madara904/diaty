import Image from 'next/image'
import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex items-center justify-center my-24">
      <div className="max-w-6xl w-full flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">
        <div className="w-full md:w-1/2 flex justify-center">
          <Image
            src="/404.svg"
            alt="404 Illustration"
            width={400}
            height={400}
            className="max-w-full h-auto"
          />
        </div>
        <div className="w-full md:w-1/2 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">Oops! Page Not Found</h1>
          <p className="text-xl text-gray-600 mb-8">
            It seems the page you're looking for has vanished into the void.
          </p>
          <Link
            href="/"
            className="bg-primary text-gray-800 hover:bg-primary/90 px-6 py-3 text-lg font-semibold transition-colors duration-300 inline-block"
          >
            Return to Home
          </Link>
          <p className="mt-8 text-gray-500">
            Lost in your thoughts? Don't worry, your diaty is still safe.
          </p>
        </div>
      </div>
    </div>
  )
}