import { PiggyBank } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function AuthCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <main className="relative mx-auto flex w-full max-w-sm flex-1 flex-col justify-center px-4 py-16">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[320px] bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,var(--color-accent),transparent)]"
        aria-hidden="true"
      />
      <Card>
        <CardHeader>
          <div className="mb-1 flex size-10 items-center justify-center rounded-lg bg-accent text-primary">
            <PiggyBank className="size-5" aria-hidden="true" />
          </div>
          <CardTitle className="text-xl">{title}</CardTitle>
        </CardHeader>
        <CardContent>{children}</CardContent>
      </Card>
    </main>
  );
}
