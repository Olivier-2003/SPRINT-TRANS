import { Button } from "@/components/ui/button";
import { logoutAction } from "@/lib/actions/auth";

export function LogoutButton() {
  return (
    <form action={logoutAction}>
      <Button type="submit" variant="outline" size="sm" className="w-full">
        Wyloguj się
      </Button>
    </form>
  );
}
