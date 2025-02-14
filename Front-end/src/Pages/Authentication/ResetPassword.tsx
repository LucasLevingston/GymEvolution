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
import { IoEyeOutline, IoEyeSharp } from 'react-icons/io5';
import Container from '@/components/Container';
import Header from '@/components/Header';

const resetPasswordSchema = z
	.object({
		password: z
			.string()
			.min(8, { message: 'Password must be at least 8 characters long' }),
		confirmPassword: z.string(),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords don't match",
		path: ['confirmPassword'],
	});

export default function ResetPassword() {
	const [passwordVisible, setPasswordVisible] = useState(false);
	const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

	const form = useForm<z.infer<typeof resetPasswordSchema>>({
		resolver: zodResolver(resetPasswordSchema),
		defaultValues: {
			password: '',
			confirmPassword: '',
		},
	});

	const togglePasswordVisibility = (field: 'password' | 'confirmPassword') => {
		if (field === 'password') {
			setPasswordVisible(!passwordVisible);
		} else {
			setConfirmPasswordVisible(!confirmPasswordVisible);
		}
	};

	const onSubmit = async (values: z.infer<typeof resetPasswordSchema>) => {
		console.log(values);
		toast.success('Password reset successfully!');
		setTimeout(() => {
			window.location.href = '/login';
		}, 2000);
	};

	return (
		<div className="min-h-screen bg-background">
			<Header />
			<Container>
				<div className="flex h-full w-full items-center justify-center">
					<Tabs defaultValue="reset" className="w-[400px]">
						<TabsList className="grid w-full bg-background">
							<Label className="text-2xl">Reset Password</Label>
						</TabsList>
						<TabsContent value="reset">
							<Card>
								<CardHeader>
									<CardTitle>Reset Your Password</CardTitle>
									<CardDescription>
										Enter your new password below.
									</CardDescription>
								</CardHeader>
								<Form {...form}>
									<form
										onSubmit={form.handleSubmit(onSubmit)}
										className="space-y-4"
									>
										<CardContent className="space-y-2">
											<FormField
												control={form.control}
												name="password"
												render={({ field }) => (
													<FormItem>
														<FormLabel>New Password</FormLabel>
														<FormControl>
															<div className="flex">
																<Input
																	type={passwordVisible ? 'text' : 'password'}
																	{...field}
																/>
																<button
																	onClick={() =>
																		togglePasswordVisibility('password')
																	}
																	className="pl-3"
																	type="button"
																>
																	{passwordVisible ? (
																		<IoEyeOutline className="h-7 w-7" />
																	) : (
																		<IoEyeSharp className="h-7 w-7" />
																	)}
																</button>
															</div>
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>
											<FormField
												control={form.control}
												name="confirmPassword"
												render={({ field }) => (
													<FormItem>
														<FormLabel>Confirm New Password</FormLabel>
														<FormControl>
															<div className="flex">
																<Input
																	type={
																		confirmPasswordVisible ? 'text' : 'password'
																	}
																	{...field}
																/>
																<button
																	onClick={() =>
																		togglePasswordVisibility('confirmPassword')
																	}
																	className="pl-3"
																	type="button"
																>
																	{confirmPasswordVisible ? (
																		<IoEyeOutline className="h-7 w-7" />
																	) : (
																		<IoEyeSharp className="h-7 w-7" />
																	)}
																</button>
															</div>
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
													'Reset Password'
												)}
											</Button>
										</CardFooter>
									</form>
								</Form>
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
