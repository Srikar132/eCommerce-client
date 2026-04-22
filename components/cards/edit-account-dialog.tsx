'use client';

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
            <DialogContent className="sm:max-w-md rounded-[2rem] p-8 md:p-10 border-none shadow-2xl overflow-hidden">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <DialogHeader className="space-y-2">
                            <DialogTitle className="h3 !text-2xl">Edit Account</DialogTitle>
                            <DialogDescription className="p-sm text-muted-foreground">
                                Update your profile information below.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-6 py-2">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem className="space-y-2">
                                        <FormLabel className="p-xs uppercase font-bold tracking-widest opacity-70 ml-1">Full Name</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Enter your full name"
                                                disabled={isPending}
                                                className="rounded-2xl h-12 border-muted-foreground/10 focus:border-accent/30 transition-all bg-muted/20"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <DialogFooter className="sm:justify-between gap-4 pt-4 border-t border-muted-foreground/10">
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={() => onOpenChange(false)}
                                disabled={isPending}
                                className="rounded-full px-8 h-12 font-bold hover:bg-muted transition-all"
                            >
                                Cancel
                            </Button>
                            <Button 
                                type="submit" 
                                disabled={isPending}
                                className="rounded-full px-10 h-12 font-bold bg-accent text-white hover:bg-accent/90 transition-all shadow-md hover:shadow-lg flex items-center gap-2"
                            >
                                {isPending ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    'Save Changes'
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
