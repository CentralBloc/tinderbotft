"use client"

import {useEffect, useState} from "react"
import {useForm} from "react-hook-form"
import {zodResolver} from "@hookform/resolvers/zod"
import {updateProfileSchema} from "@/lib/validations/user"
import {Button} from "@/components/ui/button"
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form"
import {Input} from "@/components/ui/input"
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card"
import {Loader2} from "lucide-react"
import {toast} from "@/components/ui/use-toast"
import type {z} from "zod"
import type {UserInterface} from "@/types"
import {useEditUserProfile} from "@/services/users/hooks"

type PersonalInfoProps = {
	user: UserInterface
}

export function ProfileForm({ user }: Readonly<PersonalInfoProps>) {
	const [isSubmitting, setIsSubmitting] = useState(false)
	const updateProfileMutation = useEditUserProfile()
	const form = useForm<z.infer<typeof updateProfileSchema>>({
		resolver: zodResolver(updateProfileSchema),
		defaultValues: {
			username: user?.username ?? "",
			email: user?.email ?? "",
			last_name: user?.last_name ?? "",
			first_name: user?.first_name ?? "",
		},
		mode: "all",
	})

	useEffect(() => {
		if (user) {
			form.reset({
				username: user.username ?? "",
				email: user.email ?? "",
				last_name: user.last_name ?? "",
				first_name: user.first_name ?? "",
			})
		}
	}, [form, user])

	const onSubmit = async (data: z.infer<typeof updateProfileSchema>) => {
		setIsSubmitting(true)
		try {
			// assuming user object has an id property
			await updateProfileMutation.mutateAsync({
				...data,
			})
			toast({ title: "Profile updated successfully" })
		} catch (error: any) {
			toast({
				variant: "destructive",
				title: "An error occurred",
				description: error.response?.data?.error || "Please try again",
			})
		} finally {
			setIsSubmitting(false)
		}
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>Personal Information</CardTitle>
				<CardDescription>Update your account information</CardDescription>
			</CardHeader>
			<CardContent>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
						<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
							<FormField
								control={form.control}
								name="first_name"
								render={({ field }) => (
									<FormItem>
										<FormLabel>First Name</FormLabel>
										<FormControl>
											<Input placeholder="John" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="last_name"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Last Name</FormLabel>
										<FormControl>
											<Input placeholder="Doe" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						<FormField
							control={form.control}
							name="email"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Email</FormLabel>
									<FormControl>
										<Input placeholder="johndoe@gmail.com" {...field} readOnly className="cursor-not-allowed" />
									</FormControl>
									<FormMessage />
									<p className="mt-1 text-xs text-muted-foreground">Email cannot be updated</p>
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="username"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Username</FormLabel>
									<FormControl>
										<Input placeholder="john52" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<Button type="submit" disabled={updateProfileMutation.isPending} className="mt-4">
							{(updateProfileMutation.isPending) && (
								<Loader2 className="mr-2 size-4 animate-spin" aria-hidden="true" />
							)}
							Save Changes
						</Button>
						<span className="sr-only">
							{updateProfileMutation.isPending ? "Saving..." : "Save Changes"}
						</span>
					</form>
				</Form>
			</CardContent>
		</Card>
	)
}

