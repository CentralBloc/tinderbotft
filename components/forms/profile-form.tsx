"use client"

import {useEffect} from "react"
import {useForm} from "react-hook-form"
import {zodResolver} from "@hookform/resolvers/zod"
import type {z} from "zod"
import {Button} from "@/components/ui/button"
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form"
import {Input} from "@/components/ui/input"
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card"
import {updateProfileSchema} from "@/lib/validations/user"
import {UserInterface} from "@/types";

type PersonalInfoProps = {
	user: UserInterface,
	onSubmit: (data: z.infer<typeof updateProfileSchema>) => Promise<void>
}

export function ProfileForm({ user, onSubmit }: Readonly<PersonalInfoProps>) {
	const form = useForm<z.infer<typeof updateProfileSchema>>({
		resolver: zodResolver(updateProfileSchema),
		defaultValues: {
			username: user?.username ?? "",
			email: user?.email ?? "",
		},
		mode: "all",
	})

	useEffect(() => {
		if (user) {
			form.reset({
				username: user.username ?? "",
				email: user.email ?? "",
			})
		}
	}, [form, user])

	return (
		<Card>
			<CardHeader>
				<CardTitle>Personal Information</CardTitle>
				<CardDescription >Update your account information</CardDescription>
			</CardHeader>
			<CardContent>
				<Form {...form}>
					<form onSubmit={(...args) => void form.handleSubmit(onSubmit)(...args)} className="space-y-4">
						{/* Email field */}
						<FormField
							control={form.control}
							name="email"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Email</FormLabel>
									<FormControl>
										<Input
											placeholder="johndoe@gmail.com"
											{...field}
											readOnly
											className="cursor-not-allowed "
										/>
									</FormControl>
									<FormMessage />
									<p className="mt-1 text-xs ">Email cannot be updated</p>
								</FormItem>
							)}
						/>

						{/* Username field */}
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

						<Button type="submit" className="mt-2">
							Save Changes
						</Button>
					</form>
				</Form>
			</CardContent>
		</Card>
	)
}

