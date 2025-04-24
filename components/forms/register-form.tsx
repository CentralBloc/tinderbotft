"use client";

import {PasswordInput} from "@/components/password-input";
import {Button} from "@/components/ui/button";
import {Checkbox} from "@/components/ui/checkbox";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage,} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {toast} from "@/components/ui/use-toast";
import {registerSchema} from "@/lib/validations/auth";
import {useCreateAccount} from "@/services/users/hooks";
import {zodResolver} from "@hookform/resolvers/zod";
import {Loader2} from "lucide-react";
import Link from "next/link";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {useRouter} from "next/navigation";
import {routes} from "@/lib/routes";

type Credentials = z.infer<typeof registerSchema>;

export default function RegisterForm() {
    const router = useRouter();
    const {mutate, isPending} = useCreateAccount();

    const form = useForm<Credentials>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            username: "",
            email: "",
            password: "",
            acceptTerms: undefined,
        },
        mode: "all",
    });

    const onSubmit = async (data: Credentials) => {
        // console.log(data);
        mutate(
            data,

            {
                onSuccess: () => {
                    toast({
                        title: "Account created successfully",
                        description: "You will be redirected to the login page.",
                    });
                    router.push(routes.auth.login);
                },
                onError: (error: any) => {
                    // console.log(error);
                    toast({
                        variant: "destructive",
                        title: "Something went wrong",
                        description: error.response.statusText,
                    });
                },
            },
        );
    };

    return (
        <Form {...form}>
            <form
                onSubmit={(...args) => void form.handleSubmit(onSubmit)(...args)}
                className="grid gap-y-3 md:gap-y-5"
            >
                <div className="space-y-2 md:space-y-3">
                    {/* Username field */}
                    <FormField
                        control={form.control}
                        name="username"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Username</FormLabel>
                                <FormControl>
                                    <Input placeholder="john52" {...field} />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                    {/* Email field */}
                    <FormField
                        control={form.control}
                        name="email"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input placeholder="johndoe@gmail.com" {...field} />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />

                    {/* Password field */}
                    <FormField
                        control={form.control}
                        name="password"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                    <PasswordInput placeholder="**********" {...field} />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />

                    {/* Accept items field */}
                    <FormField
                        control={form.control}
                        name="acceptTerms"
                        render={({field}) => (
                            <FormItem>
                                <div className="flex items-center space-x-2">
                                    <FormControl>
                                        <Checkbox
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                            className="rounded border-primary"
                                        />
                                    </FormControl>
                                    <label
                                        className="text-sm text-gray-700 peer-disabled:cursor-not-allowed peer-disabled:opacity-70 dark:text-foreground/90">
                                        I accept the
                                        <Link
                                            href="/terms"
                                            className="pl-1 text-primary underline dark:text-foreground/80"
                                        >
                                            terms and conditions of use
                                        </Link>
                                    </label>
                                </div>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                </div>

                <Button
                    disabled={
                        isPending || !form.formState.isValid
                    }
                    size="lg"
                >
                    {isPending && (
                        <Loader2 className="mr-2 size-4 animate-spin" aria-hidden="true"/>
                    )}
                    Register
                    <span className="sr-only">register</span>
                </Button>
            </form>
        </Form>
    );
}
