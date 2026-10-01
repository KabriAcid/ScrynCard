import { ArrowLeft, LockKeyhole } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { LoginForm } from "@/components/login-form";
import { Logo } from "@/components/logo";
import { InstantLink } from "@/components/instant-link";

export default function LoginPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#f7f6f2] px-5 py-8 text-[#18231f]">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-[0.28] [background-image:radial-gradient(#b7c4bb_0.7px,transparent_0.7px)] [background-size:22px_22px]" />
      <div aria-hidden="true" className="pointer-events-none absolute -left-40 -top-48 h-[28rem] w-[28rem] rounded-full bg-[#e8eee8] blur-3xl" />
      <div className="relative w-full max-w-[440px]">
        <header className="mb-8 flex items-center justify-between px-1">
          <Logo />
          <InstantLink to="/" className="inline-flex items-center gap-2 text-sm font-medium text-[#68766d] transition-colors hover:text-[#23352a]">
            <ArrowLeft className="h-4 w-4" /> Home
          </InstantLink>
        </header>
        <Card className="overflow-hidden rounded-[28px] border border-[#e6e8e3] bg-white shadow-[0_24px_80px_-36px_rgba(22,37,29,0.28)]">
          <div className="px-7 pb-5 pt-8 sm:px-9 sm:pt-9">
            <div className="mb-6 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[#eef3ef] text-[#46624f]">
              <LockKeyhole className="h-5 w-5" />
            </div>
            <p className="mb-2 text-sm font-semibold text-[#64736a]">Customer portal</p>
            <h1 className="text-[30px] font-bold tracking-[-0.04em] text-[#18231f]">Welcome back</h1>
            <p className="mt-2 text-sm leading-6 text-[#758078]">Sign in to manage your cards and keep your rewards moving.</p>
          </div>
          <CardContent className="px-7 pb-8 sm:px-9 sm:pb-9">
            <LoginForm />
            <div className="mt-6 border-t border-[#edf0ed] pt-5 text-center text-xs text-[#89948c]">
              Secure access to your Scryncard account
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
