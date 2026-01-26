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
import { useAuth } from "@/hooks/use-auth";
import { User } from "@/types";
import { useState } from "react";
import ErrorCard from "../cards/error-card";

const accountDetailsSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(50, "Username must not exceed 50 characters")
    .regex(
      /^[a-zA-Z0-9_-]+$/,
      "Username can only contain letters, numbers, underscores, and hyphens"
    )
    .optional()
    .or(z.literal("")),
  email: z
    .string()
    .email("Please enter a valid email address")
    .max(100, "Email must not exceed 100 characters")
    .optional()
    .or(z.literal("")),
});

type AccountDetailsFormValues = z.infer<typeof accountDetailsSchema>;

interface EditAccountDetailsFormProps {
  user: User;
}

export const EditAccountDetailsForm = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const updateProfileMutation = useUpdateUserProfile();
  const { refreshUser } = useAuth();

  const form = useForm<AccountDetailsFormValues>({
    resolver: zodResolver(accountDetailsSchema),
    defaultValues: {
      username: user?.username || "",
      email: user?.email || "",
    },
  });

  const onSubmit = async (data: AccountDetailsFormValues) => {
    updateProfileMutation.mutate(data, {
      onSuccess: async () => {
        // Refresh the user data in the auth store
        await refreshUser();
        setIsEditing(false);
        form.reset(data); // Reset form with new values
      },
    });
  };

  const handleCancel = () => {
    form.reset({
      username: user?.username || "",
      email: user?.email || "",
    });
    setIsEditing(false);
  };

  const isDirty = form.formState.isDirty;
  const isProfileIncomplete = !user?.username || !user?.email;


  if(!user) {
    return <ErrorCard
        title="User Not Found"
        message="We couldn't find your account details. Please try again later."
      />;
  }

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
        {isProfileIncomplete && !isEditing && (
          <div className="mt-4 p-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg">
            <p className="text-sm text-amber-800 dark:text-amber-200 font-medium">
              ⚠️ Complete Your Profile
            </p>
            <p className="text-xs text-amber-700 dark:text-amber-300 mt-1">
              {!user.username && !user.email && "Please add your username and email to complete your profile."}
              {!user.username && user.email && "Please add your username to complete your profile."}
              {user.username && !user.email && "Please add your email to complete your profile."}
            </p>
          </div>
        )}
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Phone (Read-only) */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">
                Phone Number
              </label>
              <div className="flex items-center gap-2">
                <Input 
                  value={user.phone ? `${user.phone}` : 'Not provided'} 
                  disabled 
                  className="bg-muted" 
                />
                {user.phoneVerified ? (
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
                Phone number cannot be changed
              </p>
            </div>

            {/* Username */}
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={!user.username ? "text-amber-700 dark:text-amber-400" : ""}>
                    Username {!user.username && <span className="text-red-500">*</span>}
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder={user.username ? "Enter your username" : "⚠️ Please set your username"}
                      disabled={!isEditing || updateProfileMutation.isPending}
                      className={!user.username && !isEditing ? "border-amber-300 dark:border-amber-700" : ""}
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

            {/* Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={!user.email ? "text-amber-700 dark:text-amber-400" : ""}>
                    Email {!user.email && <span className="text-red-500">*</span>}
                  </FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-2">
                      <Input
                        placeholder={user.email ? "Enter your email" : "⚠️ Please set your email"}
                        disabled={!isEditing || updateProfileMutation.isPending}
                        className={!user.email && !isEditing ? "border-amber-300 dark:border-amber-700 flex-1" : "flex-1"}
                        type="email"
                        {...field}
                      />
                      {user.email && (
                        user.emailVerified ? (
                          <span className="text-xs text-green-600 font-medium whitespace-nowrap">
                            ✓ Verified
                          </span>
                        ) : (
                          <span className="text-xs text-amber-600 font-medium whitespace-nowrap">
                            Not Verified
                          </span>
                        )
                      )}
                    </div>
                  </FormControl>
                  <FormDescription>
                    {user.email 
                      ? "Used for order confirmations and notifications" 
                      : "Required for receiving order updates and important notifications"
                    }
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
