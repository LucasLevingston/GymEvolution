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
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import useUser from '@/hooks/user-hooks';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { loginSchema } from '@/schemas/LogInSchema';

export default function Login() {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const { login } = useUser();

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

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
                  <CardFooter className="flex flex-col items-center justify-center">
                    <Button type="submit">
                      {form.formState.isSubmitting ? (
                        <ReloadIcon className="h-4 w-4 animate-spin" />
                      ) : (
                        'Log In'
                      )}
                    </Button>
                    <br />
                    <Link to="/password-recovery" className="text-[12px] text-mainColor">
                      Forgot password? Click here to recover
                    </Link>
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
