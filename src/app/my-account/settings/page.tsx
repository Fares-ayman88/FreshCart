"use client";

import { useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { LockKeyhole, Save, UserRound } from "lucide-react";
import { toast } from "sonner";

import { useMyAccount } from "@/components/account/my-account-shell";
import { AccountPasswordField } from "@/components/account/account-password-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { changePassword, queryKeys, updateProfile } from "@/lib/api";
import { extractErrorMessage } from "@/lib/utils";
import { useAuthStore } from "@/store/auth-store";

const profileSchema = z.object({
  name: z.string().min(3, "Your name should be at least 3 characters."),
  email: z.string().email("Enter a valid email address."),
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

export default function AccountSettingsPage() {
  const queryClient = useQueryClient();
  const { profile } = useMyAccount();
  const setSession = useAuthStore((state) => state.setSession);
  const setUser = useAuthStore((state) => state.setUser);

  const profileForm = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      email: "",
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
    if (profile) {
      profileForm.reset({
        name: profile.name,
        email: profile.email,
        phone: profile.phone,
      });
    }
  }, [profile, profileForm]);

  const updateProfileMutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: (response, values) => {
      setUser({
        ...(profile ?? {}),
        ...response.user,
        phone: values.phone,
      });
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

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h2 className="section-title text-[2rem] font-bold text-slate-950 sm:text-[2.3rem]">
          Account Settings
        </h2>
        <p className="max-w-2xl text-base leading-7 text-slate-500">
          Update your profile information and change your password
        </p>
      </div>

      <section
        className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_16px_40px_rgba(15,23,42,0.08)]"
        id="profile-information"
      >
        <div className="space-y-8 p-6 sm:p-8">
          <div className="flex items-start gap-4">
            <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[1.45rem] bg-[var(--brand-soft)] text-[var(--brand)]">
              <UserRound className="h-7 w-7" />
            </span>
            <div className="space-y-1">
              <h3 className="text-[1.75rem] font-semibold tracking-[-0.04em] text-slate-950">
                Profile Information
              </h3>
              <p className="text-base text-slate-500">
                Update your personal details
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
              className="h-14 rounded-[1rem] border-slate-200 px-5 text-[1.05rem]"
              error={profileForm.formState.errors.name?.message}
              label="Full Name"
              {...profileForm.register("name")}
            />

            <Input
              className="h-14 rounded-[1rem] border-slate-200 px-5 text-[1.05rem]"
              error={profileForm.formState.errors.email?.message}
              label="Email Address"
              {...profileForm.register("email")}
            />

            <Input
              className="h-14 rounded-[1rem] border-slate-200 px-5 text-[1.05rem]"
              error={profileForm.formState.errors.phone?.message}
              label="Phone Number"
              {...profileForm.register("phone")}
            />

            <Button
              className="h-14 rounded-[1rem] px-7 text-[1.05rem] shadow-[0_16px_28px_rgba(10,173,10,0.26)]"
              isLoading={updateProfileMutation.isPending}
              type="submit"
            >
              <Save className="mr-2 h-5 w-5" />
              Save Changes
            </Button>
          </form>
        </div>

        <div className="border-t border-slate-100 bg-slate-50/70 p-6 sm:p-8">
          <div className="space-y-6">
            <h3 className="text-[1.6rem] font-semibold tracking-[-0.04em] text-slate-950">
              Account Information
            </h3>

            <dl className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <dt className="text-sm font-medium text-slate-500">User ID</dt>
                <dd className="text-[1.02rem] text-slate-700">
                  {profile?._id ?? "-"}
                </dd>
              </div>

              <div className="space-y-2">
                <dt className="text-sm font-medium text-slate-500">Role</dt>
                <dd>
                  <span className="inline-flex rounded-full bg-[var(--brand-soft)] px-4 py-2 text-sm font-medium capitalize text-[var(--brand)]">
                    {profile?.role ?? "User"}
                  </span>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      <section
        className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_16px_40px_rgba(15,23,42,0.08)] sm:p-8"
        id="change-password"
      >
        <div className="space-y-8">
          <div className="flex items-start gap-4">
            <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[1.45rem] bg-[#fff1c7] text-[#ef7d00]">
              <LockKeyhole className="h-7 w-7" />
            </span>
            <div className="space-y-1">
              <h3 className="text-[1.75rem] font-semibold tracking-[-0.04em] text-slate-950">
                Change Password
              </h3>
              <p className="text-base text-slate-500">
                Update your account password
              </p>
            </div>
          </div>

          <form
            className="space-y-5"
            onSubmit={passwordForm.handleSubmit((values) =>
              changePasswordMutation.mutate(values),
            )}
          >
            <AccountPasswordField
              error={passwordForm.formState.errors.currentPassword?.message}
              label="Current Password"
              placeholder="Enter your current password"
              {...passwordForm.register("currentPassword")}
            />

            <AccountPasswordField
              error={passwordForm.formState.errors.password?.message}
              hint="Must be at least 6 characters"
              label="New Password"
              placeholder="Enter your new password"
              {...passwordForm.register("password")}
            />

            <AccountPasswordField
              error={passwordForm.formState.errors.rePassword?.message}
              label="Confirm New Password"
              placeholder="Confirm your new password"
              {...passwordForm.register("rePassword")}
            />

            <Button
              className="h-14 rounded-[1rem] bg-[#ef7d00] px-7 text-[1.05rem] text-white shadow-[0_16px_28px_rgba(239,125,0,0.24)] hover:bg-[#d86d00]"
              isLoading={changePasswordMutation.isPending}
              type="submit"
            >
              <LockKeyhole className="mr-2 h-5 w-5" />
              Change Password
            </Button>
          </form>
        </div>
      </section>
    </div>
  );
}
