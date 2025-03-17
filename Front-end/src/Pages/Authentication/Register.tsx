import { Tabs, TabsContent } from '@/components/ui/tabs';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { IoEyeOutline, IoEyeSharp } from 'react-icons/io5';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ReloadIcon } from '@radix-ui/react-icons';
import { toast } from 'sonner';
import useUser from '@/hooks/user-hooks';
import type { z } from 'zod';
import { registerSchema } from '@/schemas/RegisterSchema';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useState } from 'react';
import { ContainerRoot } from '@/components/Container';

export default function Register() {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const { createUser } = useUser();

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const togglePasswordVisible = () => {
    setPasswordVisible(!passwordVisible);
  };

  async function onSubmit(values: z.infer<typeof registerSchema>) {
    try {
      const response = await createUser({
        name: values.name,
        email: values.email,
        password: values.password,
      });
      if (response) {
        toast.success('User registered successfully!');
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);
      } else {
        toast.error(response);
      }
    } catch (error) {
      if (error === 'Error: User already exists') {
        toast.error('Registration error: User already registered.');
      } else {
        toast.error(`Registration error: ${error}`);
      }
    }
  }

  return (
    <ContainerRoot>
      <div className="flex h-full w-full items-center justify-center">
        <Tabs defaultValue="account" className="w-[400px]">
          <div className="flex w-full justify-center bg-background">
            <h1 className="text-2xl font-bold">Register</h1>
          </div>
          <TabsContent value="account">
            <Card>
              <CardHeader>
                <CardTitle>Registration</CardTitle>
              </CardHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <CardContent className="space-y-2">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input placeholder="John Doe" {...field} />
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
                          </FormControl>
                          <FormDescription>
                            Password must be at least 8 characters long, include an
                            uppercase letter and a special character.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirm Password</FormLabel>
                          <FormControl>
                            <div className="flex">
                              <Input
                                type={passwordVisible ? 'text' : 'password'}
                                {...field}
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
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                  <CardFooter className="flex flex-col items-center justify-center">
                    <Button type="submit">
                      {form.formState.isSubmitting ? (
                        <>
                          <ReloadIcon className="h-4 w-4 animate-spin" />
                          Loading...
                        </>
                      ) : (
                        'Register'
                      )}
                    </Button>
                    <br />
                    <p className="text-sm">Already have an account?</p>
                    <Link to="/login" className="text-[12px] text-mainColor">
                      Log in here
                    </Link>
                  </CardFooter>
                </form>
              </Form>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </ContainerRoot>
  );
}
