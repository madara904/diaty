import { FcGoogle } from "react-icons/fc"
import { signIn, auth, providerMap } from "@/auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card"
import { Button } from "@/app/components/ui/Button"
import { redirect } from "next/navigation"

export default async function SignIn() {

  const session = await auth();

  if (session?.user) {
    redirect("/")
  }

  return (
    <>
      <Card className="mx-auto max-w-sm mt-36">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Please sign-in first
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">

            {Object.values(providerMap).map((provider) => (
              <form key={provider.id}
                action={async () => {
                  "use server"
                    await signIn(provider.id, {redirectTo: "/dashboard"})
                }}
              >
                <Button type="submit" variant="outline" className="w-full">
                  <FcGoogle size={22} className="mr-2" /><span>Sign in with {provider.name}</span>
                </Button>
              </form>
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  )
}