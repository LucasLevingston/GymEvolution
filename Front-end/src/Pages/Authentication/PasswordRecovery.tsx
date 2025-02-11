'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ReloadIcon } from '@radix-ui/react-icons';
import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList } from '@/components/ui/tabs';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import Container from '@/components/Container';
import Header from '@/components/Header';

const recoverPasswordSchema = z.object({
	email: z.string().email({ message: 'Invalid email address' }),
});

export default function PasswordRecovery() {
	const [isEmailSent, setIsEmailSent] = useState(false);

	const form = useForm<z.infer<typeof recoverPasswordSchema>>({
		resolver: zodResolver(recoverPasswordSchema),
		defaultValues: {
			email: '',
		},
	});

	const onSubmit = async (values: z.infer<typeof recoverPasswordSchema>) => {
		console.log(values);

		setIsEmailSent(true);
		toast.success('Recovery email sent successfully!');
	};

	return (
		<div className="min-h-screen bg-background">
			<Header />
			<Container>
				<div className="flex h-full w-full items-center justify-center">
					<Tabs defaultValue="recover" className="w-[400px]">
						<TabsList className="grid w-full bg-background">
							<Label className="text-2xl">Recover Password</Label>
						</TabsList>
						<TabsContent value="recover">
							<Card>
								<CardHeader>
									<CardTitle>Password Recovery</CardTitle>
									<CardDescription>
										{isEmailSent
											? "We've sent you an email with recovery instructions."
											: 'Enter your email to receive a password reset link.'}
									</CardDescription>
								</CardHeader>
								{!isEmailSent && (
									<Form {...form}>
										<form
											onSubmit={form.handleSubmit(onSubmit)}
											className="space-y-4"
										>
											<CardContent className="space-y-2">
												<FormField
													control={form.control}
													name="email"
													render={({ field }) => (
														<FormItem>
															<FormLabel>Email</FormLabel>
															<FormControl>
																<Input
																	placeholder="email@example.com"
																	{...field}
																/>
															</FormControl>
															<FormMessage />
														</FormItem>
													)}
												/>
											</CardContent>
											<CardFooter className="flex flex-col items-center justify-center">
												<Button type="submit">
													{form.formState.isSubmitting ? (
														<ReloadIcon className="h-4 w-4 animate-spin" />
													) : (
														'Send Recovery Email'
													)}
												</Button>
											</CardFooter>
										</form>
									</Form>
								)}
								<CardFooter className="flex flex-col items-center justify-center">
									<Link to="/login" className="text-[12px] text-mainColor">
										Back to Login
									</Link>
								</CardFooter>
							</Card>
						</TabsContent>
					</Tabs>
				</div>
			</Container>
		</div>
	);
}
