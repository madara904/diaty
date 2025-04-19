import { cn } from "@/lib/utils"
import { Activity, Apple, DropletIcon, ArrowRight, CheckCircle2, Sparkles } from "lucide-react"
import Link from "next/link"
import { buttonVariants } from "@/app/components/ui/Button"
import Image from "next/image"

const perks = [
  {
    icon: Activity,
    color: "text-blue-600 dark:text-blue-400",
    title: "Track Daily Intakes",
    description: "Easily monitor your daily nutritional intake with our intuitive tracking system.",
    features: ["Real-time tracking", "Detailed analytics", "Custom meal plans"]
  },
  {
    icon: Apple,
    color: "text-green-600 dark:text-green-400",
    title: "Eat Healthier",
    description: "Get personalized recommendations to improve your diet and boost your vitals.",
    features: ["Smart recommendations", "Nutrition insights", "Progress tracking"]
  },
  {
    icon: DropletIcon,
    color: "text-red-600 dark:text-red-400",
    title: "Diabetic-Friendly",
    description: "Precise calculations for managing diabetic portions and maintaining blood sugar levels.",
    features: ["Blood sugar tracking", "Carb counting", "Dietary restrictions"]
  },
]

const testimonials = [
  {
    quote: "Diaty has completely transformed how I manage my nutrition. It's like having a personal dietician in my pocket!",
    author: "Sarah Johnson",
    role: "Fitness Enthusiast"
  },
  {
    quote: "As someone with diabetes, the precise tracking features have been invaluable for managing my condition.",
    author: "Michael Chen",
    role: "Diaty User"
  }
]

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <div className="bg-primary/5 border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-center gap-2 text-sm">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="font-semibold text-primary">New Feature:</span>
            <span className="text-muted-foreground">Try our AI-powered meal planning</span>
            <Link 
              href="/dashboard" 
              className="text-primary hover:text-primary/80 font-medium inline-flex items-center gap-1"
            >
              Learn more
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </div>

      <div className="flex-grow">
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 -z-10" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
            <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
              <div className="sm:text-center lg:text-left">
                <h1 className="text-6xl sm:text-7xl font-extrabold tracking-tight">
                  <span className="block">Transform Your</span>
                  <span className="block text-primary">Nutrition Journey</span>
                </h1>
                <p className="mt-6 text-xl text-muted-foreground max-w-2xl">
                  Take control of your health with personalized nutrition tracking, smart insights, and expert guidance.
                </p>
                <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <Link
                    href="/sign-in"
                    className={cn(buttonVariants({ size: "lg" }), "group")}
                  >
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                  <Link
                    href="/dashboard"
                    className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
                  >
                    Learn More
                  </Link>
                </div>
                <div className="mt-8 flex items-center gap-8 justify-center lg:justify-start">
                  <div className="flex -space-x-4">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="h-10 w-10 rounded-full border-2 border-background bg-primary/10" />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    <span className="font-semibold text-foreground">1000+</span> active users
                  </p>
                </div>
              </div>
              <div className="mt-12 lg:mt-0 relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-secondary/20 blur-3xl -z-10" />
                <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                  <Image
                    src="/hero-section.svg"
                    alt="Healthy food illustration"
                    width={600}
                    height={600}
                    className="dark:opacity-90"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent" />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-24 bg-secondary/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
                Everything you need for a healthier lifestyle
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Comprehensive tools and features designed to help you achieve your health goals
              </p>
            </div>

            <div className="mt-20">
              <div className="grid gap-12 md:grid-cols-3">
                {perks.map((perk) => (
                  <div key={perk.title} className="relative group">
                    <div className="absolute -inset-4 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="relative p-6 bg-card rounded-2xl border border-border/50 group-hover:border-primary/50 transition-colors">
                      <div className={cn("inline-flex p-3 rounded-xl", perk.color, "bg-primary/10")}>
                        <perk.icon className="h-6 w-6" />
                      </div>
                      <h3 className="mt-4 text-xl font-semibold">{perk.title}</h3>
                      <p className="mt-2 text-muted-foreground">{perk.description}</p>
                      <ul className="mt-4 space-y-2">
                        {perk.features.map((feature) => (
                          <li key={feature} className="flex items-center gap-2 text-sm">
                            <CheckCircle2 className="h-4 w-4 text-primary" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>


        <section className="py-24 bg-secondary/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
                Loved by health enthusiasts
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                See what our users have to say about their experience with Diaty
              </p>
            </div>
            <div className="grid gap-8 md:grid-cols-2">
              {testimonials.map((testimonial, index) => (
                <div 
                  key={index} 
                  className="p-8 bg-card rounded-xl border border-border hover:border-primary/50 transition-colors"
                >
                  <div className="text-primary mb-4">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M14.017 21V7.591C14.017 4.33 15.017 2 17.517 2C19.917 2 21.017 4.33 21.017 7.591V21H14.017ZM3.017 21V7.591C3.017 4.33 4.017 2 6.517 2C8.917 2 10.017 4.33 10.017 7.591V21H3.017Z" fill="currentColor"/>
                    </svg>
                  </div>
                  <p className="text-lg leading-relaxed">{testimonial.quote}</p>
                  <div className="mt-6 flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-lg font-semibold text-primary">
                        {testimonial.author.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold">{testimonial.author}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-16 text-center text-sm text-muted-foreground">
              Join our growing community of health enthusiasts
            </div>
          </div>
        </section>


        <section className="py-24 bg-primary text-primary-foreground">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Ready to transform your health?
            </h2>
            <p className="mt-4 text-xl text-primary-foreground/90 max-w-2xl mx-auto">
              Join thousands of users who have already started their journey to better health with Diaty
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/sign-in"
                className={cn(
                  buttonVariants({ size: "lg", variant: "secondary" }), 
                  "group"
                )}
              >
                Get Started Now
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/dashboard"
                className={cn(
                  buttonVariants({ size: "lg", variant: "outline" }), 
                  "bg-transparent border-primary-foreground/20 hover:border-primary-foreground/40"
                )}
              >
                View Features
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-8 text-primary-foreground/80">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5" />
                <span>Free 14-day trial</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5" />
                <span>Cancel anytime</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}