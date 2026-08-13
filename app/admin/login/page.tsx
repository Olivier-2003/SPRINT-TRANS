import { Bus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { LoginForm } from "@/components/forms/LoginForm";
import { loginAction } from "@/lib/actions/auth";

export default function AdminLoginPage() {
  return (
    <div className="dark flex flex-1 items-center justify-center bg-background p-6 text-foreground">
      <div className="flex w-full max-w-sm flex-col items-center gap-6">
        <div className="flex items-center gap-2.5">
          <div className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Bus className="size-5" />
          </div>
          <div className="leading-tight">
            <p className="text-base font-bold tracking-tight">SPRINT-TRANS</p>
            <p className="text-[11px] tracking-wide text-muted-foreground uppercase">Panel administratora</p>
          </div>
        </div>
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Logowanie do panelu</CardTitle>
            <CardDescription>Wprowadź dane konta administratora.</CardDescription>
          </CardHeader>
          <CardContent>
            <LoginForm action={loginAction} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
