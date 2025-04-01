'use client';

import { ReloadIcon } from '@radix-ui/react-icons';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { IoEyeOutline, IoEyeSharp } from 'react-icons/io5';
import { Link, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import useUser from '@/hooks/user-hooks';
import { GoogleButton } from '@/components/GoogleButton';
import { Separator } from '@/components/ui/separator';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { z } from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { loginSchema } from '@/schemas/LogInSchema';
import { useEffect } from 'react';

export default function Login() {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const { login, loginWithGoogle } = useUser();
  const [searchParams] = useSearchParams();

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // Check for error in URL params (from Google auth callback)
  useEffect(() => {
    const error = searchParams.get('error');
    if (error) {
      toast.error(
        error === 'authentication_failed'
          ? 'Authentication failed. Please try again.'
          : 'An error occurred during login.'
      );
    }
  }, [searchParams]);

  const toggleShowPassword = () => {
    setPasswordVisible(!passwordVisible);
  };

  const onSubmit = async (values: z.infer<typeof loginSchema>) => {
    try {
      await login({ email: values.email, password: values.password });

      toast.success('Login successfully!');
      setTimeout(() => {
        window.location.href = '/';
      }, 2000);
    } catch (error: any) {
      return toast.error(error.message);
    }
  };

  const handleGoogleLogin = () => {
    loginWithGoogle();
  };

  return (
    <>
      <div className="flex h-full w-full items-center justify-center">
        <Tabs defaultValue="account" className="w-[400px]">
          <div className="flex w-full justify-center bg-background">
            <h1 className="text-2xl font-bold ">Log in to your account</h1>
          </div>
          <TabsContent value="account">
            <Card>
              <CardHeader>
                <CardTitle>Login</CardTitle>
              </CardHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <CardContent className="space-y-2">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="email@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <div className="flex">
                              <Input
                                type={passwordVisible ? 'text' : 'password'}
                                {...field}
                              />
                              <button
                                onClick={toggleShowPassword}
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
                  </CardContent>
                  <CardFooter className="flex flex-col items-center justify-center gap-2">
                    <Button type="submit" className="w-full">
                      {form.formState.isSubmitting ? (
                        <ReloadIcon className="h-4 w-4 animate-spin" />
                      ) : (
                        'Log In'
                      )}
                    </Button>

                    <Separator className="my-2" />

                    <GoogleButton onClick={handleGoogleLogin} />

                    <div className="mt-2">
                      <Link
                        to="/password-recovery"
                        className="text-[12px] text-mainColor"
                      >
                        Forgot password? Click here to recover
                      </Link>
                    </div>
                  </CardFooter>
                </form>
              </Form>
              <CardFooter className="flex flex-col items-center justify-center">
                <Label>Don't have an account?</Label>
                <Link to="/register" className="text-[12px] text-mainColor">
                  Register here!
                </Link>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
