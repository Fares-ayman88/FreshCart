import { redirect } from "next/navigation";

export default function SettingsPage() {
  redirect("/my-account/settings#change-password");
}
