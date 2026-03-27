"use client";

import { useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { KeyRound, UserRoundCog } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { changePassword, getProfile, queryKeys, updateProfile } from "@/lib/api";
import { useProtectedRoute } from "@/lib/hooks";
import { extractErrorMessage } from "@/lib/utils";
import { useAuthStore } from "@/store/auth-store";

const profileSchema = z.object({
  name: z.string().min(3, "Your name should be at least 3 characters."),
  phone: z
    .string()
    .regex(/^01[0125][0-9]{8}$/, "Use a valid Egyptian phone number."),
});

const passwordSchema = z
  .object({
    currentPassword: z.string().min(6, "Current password is required."),
    password: z.string().min(6, "New password should be at least 6 characters."),
    rePassword: z.string(),
  })
  .refine((values) => values.password === values.rePassword, {
    message: "Passwords do not match.",
    path: ["rePassword"],
  });

type ProfileValues = z.infer<typeof profileSchema>;
type PasswordValues = z.infer<typeof passwordSchema>;

export default function ProfilePage() {
  const queryClient = useQueryClient();
  const setSession = useAuthStore((state) => state.setSession);
  const { canRender, hydrated } = useProtectedRoute();

  const profileQuery = useQuery({
    queryKey: queryKeys.me,
    queryFn: getProfile,
    enabled: canRender,
  });

  const profileForm = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      phone: "",
    },
  });

  const passwordForm = useForm<PasswordValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      password: "",
      rePassword: "",
    },
  });

  useEffect(() => {
    if (profileQuery.data?.data) {
      profileForm.reset({
        name: profileQuery.data.data.name,
        phone: profileQuery.data.data.phone,
      });
    }
  }, [profileForm, profileQuery.data]);

  const updateProfileMutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      toast.success("Profile updated successfully.");
      queryClient.invalidateQueries({ queryKey: queryKeys.me });
    },
    onError: (error) => {
      toast.error(extractErrorMessage(error));
    },
  });

  const changePasswordMutation = useMutation({
    mutationFn: changePassword,
    onSuccess: (response) => {
      setSession({
        token: response.token,
        user: response.user,
      });
      toast.success("Password changed successfully.");
      queryClient.invalidateQueries({ queryKey: queryKeys.me });
      passwordForm.reset();
    },
    onError: (error) => {
      toast.error(extractErrorMessage(error));
    },
  });

  if (!hydrated || !canRender) {
    return <div className="h-[60vh] animate-pulse rounded-[2rem] bg-white/70" />;
  }

  return (
    <div className="grid gap-8 xl:grid-cols-[0.9fr_1.1fr]">
      <section className="hero-grid surface-card rounded-[2rem] p-8">
        <div className="space-y-4">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[var(--brand)]">
            User profile
          </p>
          <h1 className="section-title text-4xl font-bold text-slate-950">
            Keep your account details accurate and secure
          </h1>
          <p className="text-base leading-8 text-slate-600">
            Update your profile data for orders and delivery, then rotate your
            password without leaving the app.
          </p>
        </div>

        <div className="mt-8 rounded-[1.75rem] border border-white/70 bg-white/80 p-5">
          <p className="text-sm font-semibold text-slate-950">Current account</p>
          <div className="mt-3 space-y-2 text-sm text-slate-600">
            <p>Name: {profileQuery.data?.data.name ?? "Loading..."}</p>
            <p>Email: {profileQuery.data?.data.email ?? "Loading..."}</p>
            <p>Phone: {profileQuery.data?.data.phone ?? "Loading..."}</p>
          </div>
        </div>
      </section>

      <div className="space-y-8">
        <section className="surface-card rounded-[2rem] p-6">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--brand-soft)] text-[var(--brand)]">
              <UserRoundCog className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-slate-950">Edit profile</h2>
              <p className="text-sm text-slate-500">
                Update the information used during checkout.
              </p>
            </div>
          </div>

          <form
            className="space-y-5"
            onSubmit={profileForm.handleSubmit((values) =>
              updateProfileMutation.mutate(values),
            )}
          >
            <Input
              error={profileForm.formState.errors.name?.message}
              label="Full name"
              {...profileForm.register("name")}
            />

            <Input
              error={profileForm.formState.errors.phone?.message}
              label="Phone number"
              {...profileForm.register("phone")}
            />

            <Button
              isLoading={updateProfileMutation.isPending}
              size="lg"
              type="submit"
            >
              Save profile
            </Button>
          </form>
        </section>

        <section className="surface-card rounded-[2rem] p-6">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-white">
              <KeyRound className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-slate-950">
                Change password
              </h2>
              <p className="text-sm text-slate-500">
                Set a new password and keep the session updated automatically.
              </p>
            </div>
          </div>

          <form
            className="space-y-5"
            onSubmit={passwordForm.handleSubmit((values) =>
              changePasswordMutation.mutate(values),
            )}
          >
            <Input
              error={passwordForm.formState.errors.currentPassword?.message}
              label="Current password"
              type="password"
              {...passwordForm.register("currentPassword")}
            />

            <div className="grid gap-5 md:grid-cols-2">
              <Input
                error={passwordForm.formState.errors.password?.message}
                label="New password"
                type="password"
                {...passwordForm.register("password")}
              />
              <Input
                error={passwordForm.formState.errors.rePassword?.message}
                label="Confirm new password"
                type="password"
                {...passwordForm.register("rePassword")}
              />
            </div>

            <Button
              isLoading={changePasswordMutation.isPending}
              size="lg"
              type="submit"
              variant="secondary"
            >
              Update password
            </Button>
          </form>
        </section>
      </div>
    </div>
  );
}
