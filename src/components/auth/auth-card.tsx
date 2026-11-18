import { PiggyBank } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function AuthCard({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <main className="relative mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-4 py-16">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-10 -z-10 h-72 bg-[radial-gradient(closest-side,var(--glow),transparent)] opacity-50"
      />
      <Card className="shadow-xl shadow-black/20">
        <CardHeader className="items-center gap-3 text-center">
          <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-accent text-accent-foreground">
            <PiggyBank className="size-6" aria-hidden="true" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">{title}</CardTitle>
          {description && <CardDescription className="text-[0.95rem]">{description}</CardDescription>}
        </CardHeader>
        <CardContent className="pt-2">{children}</CardContent>
      </Card>
    </main>
  );
}
