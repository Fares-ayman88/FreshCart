import { redirect } from "next/navigation";

export default function ProfilePage() {
  redirect("/my-account/settings#profile-information");
}
