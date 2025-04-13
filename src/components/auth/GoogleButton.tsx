import { useGoogleAuth } from "@/hooks/auth";
import { Button } from "@/components/ui/button";
import { FaGoogle } from "react-icons/fa";

export function GoogleButton() {
  const { getGoogleAuthUrl, isRedirecting } = useGoogleAuth();

  const handleGoogleLogin = () => {
    getGoogleAuthUrl.mutate();
  };

  return (
    <Button
      type="button"
      variant="outline"
      onClick={handleGoogleLogin}
      disabled={isRedirecting || getGoogleAuthUrl.isPending}
      className="w-full flex items-center justify-center gap-2"
    >
      <FaGoogle className="h-4 w-4" />
      <span>
        {isRedirecting ? "Đang chuyển hướng..." : "Đăng nhập với Google"}
      </span>
    </Button>
  );
}
