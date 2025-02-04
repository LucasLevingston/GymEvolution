import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList } from '@/components/ui/tabs';
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
import { IoEyeOutline, IoEyeSharp } from 'react-icons/io5';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ReloadIcon } from '@radix-ui/react-icons';
import { toast } from 'sonner';
import useUser from '@/hooks/user-hooks';
import { z } from 'zod';
import { registerSchema } from '@/schemas/RegisterSchema';
import Container from '@/components/Container';
import Header from '@/components/Header';

export default function UserRegistration() {
	const [passwordVisible, setPasswordVisible] = useState(false);
	const [loading, setLoading] = useState(false);
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [passwordTouched, setPasswordTouched] = useState(false);
	const [differentPasswords, setDifferentPasswords] = useState(false);

	const { createUser } = useUser();

	const togglePasswordVisible = () => {
		setPasswordVisible(!passwordVisible);
	};

	function validatePassword() {
		if (!passwordTouched) return true;

		if (password !== confirmPassword) return false;

		const uppercaseExpression = /[A-Z]/;
		const specialCharacterExpression = /[!@#$%^&*(),.?":{}|<>]/;

		const validLength = password.length >= 8 && confirmPassword.length >= 8;
		const validUppercase =
			uppercaseExpression.test(password) &&
			uppercaseExpression.test(confirmPassword);
		const validSpecialCharacter =
			specialCharacterExpression.test(password) &&
			specialCharacterExpression.test(confirmPassword);

		return validLength && validUppercase && validSpecialCharacter;
	}

	async function handleRegister(event: React.FormEvent) {
		event.preventDefault();
		setLoading(true);
		try {
			const validation = validatePassword();
			if (!validation) {
				setDifferentPasswords(true);
				toast.error('Passwords must match and meet the requirements.');
				return;
			} else setDifferentPasswords(false);

			registerSchema.parse({
				email,
				password: password,
				confirmPassword: confirmPassword,
			});

			const response = await createUser(email, password);
			if (response) {
				toast.success('User registered successfully!');
				setTimeout(() => {
					window.location.href = '/login';
				}, 2000);
			} else {
				toast.error(response.message);
			}
		} catch (error) {
			if (error instanceof z.ZodError) {
				toast.error(
					'Validation error: ' +
						error.errors.map((err) => err.message).join(', ')
				);
			} else {
				if (error === 'Error: User already exists') {
					toast.error(`Registration error: User already registered.`);
				} else {
					toast.error(`Registration error: ${error}`);
				}
			}
		} finally {
			setLoading(false);
		}
	}

	return (
		<>
			<Header />
			<Container>
				<div className="flex h-full w-full items-center justify-center pt-10">
					<Tabs defaultValue="account" className="w-[400px]">
						<TabsList className="bg-darkGray grid w-full">
							<Label className="text-2xl text-white">Register</Label>
						</TabsList>
						<TabsContent value="account">
							<Card>
								<CardHeader>
									<CardTitle>Registration</CardTitle>
									<CardDescription></CardDescription>
								</CardHeader>
								<form onSubmit={handleRegister}>
									<CardContent className="space-y-2">
										<div className="space-y-1">
											<Label htmlFor="email">Email</Label>
											<Input
												id="email"
												type="email"
												required
												autoComplete="email"
												defaultValue=""
												onChange={(e) => setEmail(e.target.value)}
											/>
										</div>
										<div className="space-y-1">
											<Label htmlFor="password">Password</Label>
											<div className="flex">
												<Input
													id="password"
													type={passwordVisible ? 'text' : 'password'}
													required
													minLength={8}
													value={password}
													autoComplete="new-password"
													onChange={(e) => {
														setPassword(e.target.value);
														setPasswordTouched(true);
													}}
													onBlur={() => setPasswordTouched(true)}
												/>
												<button
													onClick={togglePasswordVisible}
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
										</div>
										<div className="space-y-1">
											<Label htmlFor="confirmPassword">Confirm Password</Label>
											<div className="flex">
												<Input
													id="confirmPassword"
													type={passwordVisible ? 'text' : 'password'}
													required
													autoComplete="new-password"
													minLength={8}
													value={confirmPassword}
													onChange={(e) => {
														setConfirmPassword(e.target.value);
														setPasswordTouched(true);
													}}
													onBlur={() => setPasswordTouched(true)}
												/>
												<button
													onClick={togglePasswordVisible}
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
											{differentPasswords && (
												<p className="text-red text-xs">
													Passwords must match and have at least 8 characters,
													including one uppercase and one special character.
												</p>
											)}
										</div>
									</CardContent>
									<CardFooter className="flex flex-col items-center justify-center">
										{loading ? (
											<Button disabled>
												<ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
												Loading...
											</Button>
										) : (
											<Button variant="outline" type="submit">
												Register
											</Button>
										)}
										<br />
										<p className="text-sm">Already have an account?</p>
										<Link to="/login" className="text-[12px] text-mainColor">
											Log in here
										</Link>
									</CardFooter>
								</form>
							</Card>
						</TabsContent>
					</Tabs>
				</div>
			</Container>
		</>
	);
}
