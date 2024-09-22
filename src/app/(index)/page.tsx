import { cn } from "@/lib/utils"
import { Activity, Apple, DropletIcon } from "lucide-react"
import Link from "next/link"
import { buttonVariants } from "@/app/components/ui/Button"
import Image from "next/image"

const perks = [
  {
    icon: Activity,
    color: "text-blue-600",
    title: "Track Daily Intakes",
    description: "Easily monitor your daily nutritional intake with our intuitive tracking system.",
  },
  {
    icon: Apple,
    color: "text-green-600",
    title: "Eat Healthier",
    description: "Get personalized recommendations to improve your diet and boost your vitals.",
  },
  {
    icon: DropletIcon,
    color: "text-red-600",
    title: "Diabetic-Friendly",
    description: "Precise calculations for managing diabetic portions and maintaining blood sugar levels.",
  },
]

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-grow">
        <section className="relative">
          <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
            <div className="lg:grid lg:grid-cols-2 lg:gap-28 items-center">
              <div className="sm:text-center lg:text-left">
                <h1 className="text-7xl tracking-tight font-extrabold text-gray-900 sm:text-6xl md:text-7xl">
                  <span className="block">Discover</span>
                  <span className="block text-primary">diaty</span>
                </h1>
                <p className="mt-5 text-lg text-gray-500 sm:mt-6 sm:text-xl sm:max-w-xl sm:mx-auto lg:mx-0">
                  Start your healthy journey today with personalized nutrition tracking and insights.
                </p>
                <div className="mt-8 sm:mt-10 sm:flex sm:justify-center lg:justify-start">
                  <div className="rounded-md shadow">
                    <Link
                      href="/sign-in"
                      className={cn(buttonVariants({ size: "lg" }), "w-full")}
                    >
                      Get Started
                    </Link>
                  </div>
                  <div className="mt-4 sm:mt-0 sm:ml-3">
                    <Link
                      href="/dashboard"
                      className={cn(buttonVariants({ variant: "outline", size: "lg" }), "w-full")}
                    >
                      Browse Foods
                    </Link>
                  </div>
                </div>
              </div>
              <div className="mt-12 lg:mt-0 lg:ml-8">
                <Image
                  src="/hero-section.svg" 
                  alt="Healthy food illustration"
                  width={400} 
                  height={400} 
                  className="rounded-lg shadow-xl"
                />
              </div>
            </div>
          </div>
        </section>


        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="lg:text-center">
              <h2 className="text-base text-primary font-semibold tracking-wide uppercase">Features</h2>
              <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                Everything you need for a healthier you
              </p>
            </div>

            <div className="mt-12">
              <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-3 md:gap-x-8 md:gap-y-10">
                {perks.map((perk) => (
                  <div key={perk.title} className="relative">
                    <dt>
                      <div className={cn("absolute flex items-center justify-center h-12 w-12 rounded-md text-white", perk.color.replace("", ""))}>
                        <perk.icon className="h-6 w-6" aria-hidden="true" />
                      </div>
                      <p className="ml-16 text-lg leading-6 font-medium text-gray-900">{perk.title}</p>
                    </dt>
                    <dd className="mt-2 ml-16 text-base text-gray-500">{perk.description}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </section>

        <section className="bg-primary">
          <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
            <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              <span className="block">Ready to dive in?</span>
              <span className="block text-white">Start your free trial today.</span>
            </h2>
            <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
              <div className="inline-flex rounded-md shadow">
                <Link
                  href="/sign-in"
                  className={cn(buttonVariants({ variant: "secondary", size: "lg" }))}
                >
                  Get started
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
