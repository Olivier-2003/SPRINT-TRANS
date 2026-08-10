import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoginForm } from "@/components/forms/LoginForm";
import { loginAction } from "@/lib/actions/auth";

export default function AdminLoginPage() {
  return (
    <div className="flex flex-1 items-center justify-center p-6">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Logowanie do panelu</CardTitle>
        </CardHeader>
        <CardContent>
          <LoginForm action={loginAction} />
        </CardContent>
      </Card>
    </div>
  );
}
