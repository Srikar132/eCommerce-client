"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Save, X } from "lucide-react";
import { useUpdateUserProfile } from "@/lib/tanstack/queries/user-profile.queries";
import { useAuthStore } from "@/lib/store/auth-store";
import { User } from "@/types";
import { useState } from "react";

const accountDetailsSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(50, "Username must not exceed 50 characters")
    .regex(
      /^[a-zA-Z0-9_-]+$/,
      "Username can only contain letters, numbers, underscores, and hyphens"
    ),
  phone: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^\+?[1-9]\d{1,14}$/.test(val),
      "Please enter a valid phone number"
    ),
});

type AccountDetailsFormValues = z.infer<typeof accountDetailsSchema>;

interface EditAccountDetailsFormProps {
  user: User;
}

export const EditAccountDetailsForm = ({ user }: EditAccountDetailsFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const updateProfileMutation = useUpdateUserProfile();
  const updateUserInStore = useAuthStore((state) => state.updateUser);

  const form = useForm<AccountDetailsFormValues>({
    resolver: zodResolver(accountDetailsSchema),
    defaultValues: {
      username: user.username || "",
      phone: user.phone || "",
    },
  });

  const onSubmit = async (data: AccountDetailsFormValues) => {
    updateProfileMutation.mutate(data, {
      onSuccess: (updatedUser) => {
        // Update the user in the auth store
        updateUserInStore(updatedUser);
        setIsEditing(false);
        form.reset(data); // Reset form with new values
      },
    });
  };

  const handleCancel = () => {
    form.reset({
      username: user.username || "",
      phone: user.phone || "",
    });
    setIsEditing(false);
  };

  const isDirty = form.formState.isDirty;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Account Details</CardTitle>
          {!isEditing && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(true)}
            >
              Edit
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Email (Read-only) */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">
                Email
              </label>
              <div className="flex items-center gap-2">
                <Input value={user.email} disabled className="bg-muted" />
                {user.emailVerified ? (
                  <span className="text-xs text-green-600 font-medium whitespace-nowrap">
                    ✓ Verified
                  </span>
                ) : (
                  <span className="text-xs text-amber-600 font-medium whitespace-nowrap">
                    Not Verified
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Email cannot be changed
              </p>
            </div>

            {/* Username */}
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your username"
                      disabled={!isEditing || updateProfileMutation.isPending}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    This is your public display name
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Phone */}
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your phone number"
                      disabled={!isEditing || updateProfileMutation.isPending}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Optional - Used for order updates and delivery
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Account Info (Read-only) */}
            <div className="pt-4 border-t space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Account Role</span>
                <span className="font-medium capitalize">{user.role.toLowerCase()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Member Since</span>
                <span className="font-medium">
                  {new Date(user.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
            </div>

            {/* Action Buttons (Only show when editing) */}
            {isEditing && (
              <div className="flex gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={handleCancel}
                  disabled={updateProfileMutation.isPending}
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1"
                  disabled={updateProfileMutation.isPending || !isDirty}
                >
                  <Save className="h-4 w-4 mr-2" />
                  {updateProfileMutation.isPending ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            )}
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
