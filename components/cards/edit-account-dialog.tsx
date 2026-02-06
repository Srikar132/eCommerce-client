'use client';

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useUpdateAccountDetails } from '@/lib/tanstack/queries/account.queries';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { accountDetailsSchema } from '@/lib/validations';
import { z } from 'zod';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useEffect } from 'react';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';

interface EditAccountDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    currentName: string;
    currentEmail: string;
}

type AccountDetailsFormData = z.infer<typeof accountDetailsSchema>;

export function EditAccountDialog({ open, onOpenChange, currentName, currentEmail }: EditAccountDialogProps) {
    const { mutate: updateAccount, isPending } = useUpdateAccountDetails();

    const form = useForm<AccountDetailsFormData>({
        resolver: zodResolver(accountDetailsSchema),
        defaultValues: {
            name: currentName,
            email: currentEmail,
        },
    });

    // Update form values when props change
    useEffect(() => {
        form.reset({
            name: currentName,
            email: currentEmail,
        });
    }, [currentName, currentEmail, form]);

    const onSubmit = (data: AccountDetailsFormData) => {
        updateAccount(
            data,
            {
                onSuccess: (result) => {
                    if (result.success) {
                        toast.success(result.message);
                        onOpenChange(false);
                    } else {
                        toast.error(result.error);
                    }
                },
                onError: (error) => {
                    toast.error(error.message || 'Failed to update account');
                },
            }
        );
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-106.25">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <DialogHeader>
                            <DialogTitle>Edit Account Details</DialogTitle>
                            <DialogDescription>
                                Update your name and email address. Click save when you're done.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Full Name</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Enter your full name"
                                                disabled={isPending}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email Address</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="email"
                                                placeholder="Enter your email"
                                                disabled={isPending}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                        <p className="text-xs text-muted-foreground">
                                            Changing your email will require verification.
                                        </p>
                                    </FormItem>
                                )}
                            />
                        </div>
                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => onOpenChange(false)}
                                disabled={isPending}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isPending}>
                                {isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                Save Changes
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
