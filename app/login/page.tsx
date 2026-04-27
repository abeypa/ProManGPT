import { Suspense } from "react";
import { LoginForm } from "@/components/login-form";

export default function LoginPage() {
  return (
    <main className="grid min-h-screen grid-cols-1 bg-white lg:grid-cols-[1.05fr_0.95fr]">
      <section className="flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <p className="text-sm font-semibold uppercase tracking-wide text-primary">Engineering operations</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight">Project management for technical teams</h1>
            <p className="mt-3 text-sm text-muted-foreground">
              Sign in to manage projects, stages, tasks, purchase updates, files, approvals, and activity.
            </p>
          </div>
          <Suspense>
            <LoginForm />
          </Suspense>
        </div>
      </section>
      <section className="hidden bg-[linear-gradient(135deg,#0f766e,#0e7490_55%,#f59e0b)] p-10 lg:flex lg:items-end">
        <div className="max-w-xl text-white">
          <h2 className="text-4xl font-semibold">From design review to delivery, one operating system.</h2>
          <p className="mt-4 text-sm leading-6 text-white/85">
            Built for mechanical, electrical, software, purchase, production, installation, planning, and QA/QC workflows.
          </p>
        </div>
      </section>
    </main>
  );
}
