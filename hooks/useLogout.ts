import { useDispatch } from "react-redux";
import { clearUser } from "@/store/authSlice";
import { useRouter } from "next/navigation";

export function useLogout() {
  const dispatch = useDispatch();
  const router = useRouter();

  return async function logout() {
    await fetch("/api/auth/signout", { method: "POST" });
    dispatch(clearUser());
    router.push("/auth/sign-in");
  };
}
