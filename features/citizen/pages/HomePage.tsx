import { Button } from "@/components/ui/button";
import { ArrowRight, Gift, ShieldCheck, TrendingUp } from "lucide-react";
import { Logo } from "@/components/logo";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col">
      <header className="container mx-auto flex h-20 items-center justify-between px-4 md:px-6">
        <Logo />
        <div className="flex items-center gap-2">
          <Button variant="ghost" onClick={() => navigate("/login")}>
            Login
          </Button>
          <Button onClick={() => navigate("/redeem")}>
            <span className="sm:hidden">Redeem</span>
            <span className="hidden sm:block">Redeem Card</span>
          </Button>
        </div>
      </header>
      <main className="flex-1">
        <section className="relative w-full py-20 md:py-32 lg:py-40 bg-gradient-to-b from-primary/10 to-background">
          <div className="container relative z-10 mx-auto px-4 text-center md:px-6">
            <h1 className="text-4xl font-bold tracking-tighter text-foreground sm:text-5xl md:text-6xl lg:text-7xl">
              Empowering Nigerian Communities
            </h1>
            <p className="mx-auto mt-4 max-w-[700px] text-lg text-muted-foreground md:text-xl">
              A transparent, efficient, and secure platform for distributing
              funds through digital scratch cards.
            </p>
            <div className="mt-12 flex justify-center">
              <Button
                size="lg"
                className="group relative h-16 px-12 text-lg font-bold transition-all duration-500"
                onClick={() => navigate("/redeem")}
              >
                <div className="relative flex items-center gap-3">
                  <Gift className="h-6 w-6 transition-transform duration-500 group-hover:rotate-6 group-hover:scale-105" />
                  <span>Redeem Your Card</span>
                  <ArrowRight className="h-6 w-6 transition-all duration-500 group-hover:translate-x-1" />
                </div>
              </Button>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 py-20 md:px-6 md:py-32">
          <div className="mx-auto grid max-w-5xl items-center gap-8 lg:grid-cols-2 lg:gap-16">
            <div className="space-y-4">
              <div className="inline-block rounded-lg bg-secondary px-3 py-1 text-sm">
                Key Features
              </div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                A Modern Solution for Community Support
              </h2>
              <p className="text-muted-foreground md:text-lg">
                Scryn provides a modern toolkit for politicians and a secure way
                for citizens to receive support.
              </p>
            </div>
            <div className="grid gap-6">
              <div className="flex items-start gap-4">
                <div className="rounded-full bg-primary/10 p-3">
                  <Gift className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Seamless Distribution</h3>
                  <p className="text-sm text-muted-foreground">
                    Easily create and distribute uniquely branded scratch cards
                    for your campaign.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="rounded-full bg-primary/10 p-3">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Real-Time Analytics</h3>
                  <p className="text-sm text-muted-foreground">
                    Track redemption rates, geographic distribution, and ROI on
                    your dashboard.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="rounded-full bg-primary/10 p-3">
                  <ShieldCheck className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Advanced Fraud Prevention</h3>
                  <p className="text-sm text-muted-foreground">
                    Our AI-powered tools monitor and flag suspicious activities
                    to ensure security.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t bg-secondary/50">
        <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 py-8 md:flex-row md:px-6">
          <Logo />
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Scryn. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <button className="text-sm hover:underline" onClick={() => navigate("/")}>
              Terms of Service
            </button>
            <button className="text-sm hover:underline" onClick={() => navigate("/")}>
              Privacy Policy
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

