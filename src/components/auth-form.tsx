
"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"
import { loginAction } from "@/app/actions"
import { useRouter } from "next/navigation"

const loginSchema = z.object({
  email: z.string().email({ message: "সঠিক ইমেইল দিন।" }),
  password: z.string().min(6, { message: "পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।" }),
});

const signupSchema = z.object({
  name: z.string().min(3, { message: "নাম কমপক্ষে ৩ অক্ষরের হতে হবে।" }),
  email: z.string().email({ message: "সঠিক ইমেইল দিন।" }),
  password: z.string().min(6, { message: "পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।" }),
});

type LoginFormValues = z.infer<typeof loginSchema>;
type SignupFormValues = z.infer<typeof signupSchema>;

export default function AuthForm() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
        email: "admin@bartanow.com",
        password: "password123",
    }
  });

  const signupForm = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
  });

  const onLoginSubmit = async (data: LoginFormValues) => {
    setLoading(true);
    const result = await loginAction(data);
    setLoading(false);

    if (result.success) {
      toast({
        title: "লগইন সফল",
        description: "আপনাকে ড্যাশবোর্ডে পাঠানো হচ্ছে...",
      });
      router.push('/admin');
    } else {
      toast({
        variant: "destructive",
        title: "লগইন ব্যর্থ",
        description: result.message,
      });
    }
  };

  const onSignupSubmit = (data: SignupFormValues) => {
    setLoading(true);
    console.log("Signup data:", data);
    // TODO: Implement actual signup logic
    setTimeout(() => {
        setLoading(false);
        toast({
            title: "একাউন্ট তৈরি সফল",
            description: "আপনার একাউন্ট তৈরি হয়েছে। অনুগ্রহ করে লগইন করুন।",
        });
    }, 1500);
  };
  
  return (
    <Tabs defaultValue="login" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="login">লগইন করুন</TabsTrigger>
        <TabsTrigger value="signup">একাউন্ট তৈরি করুন</TabsTrigger>
      </TabsList>
      <TabsContent value="login">
        <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="grid gap-4 mt-4">
          <div className="grid gap-2">
            <Label htmlFor="login-email">ইমেইল</Label>
            <Input
              id="login-email"
              type="email"
              placeholder="আপনার ইমেইল"
              {...loginForm.register("email")}
            />
            {loginForm.formState.errors.email && (
              <p className="text-xs text-destructive">{loginForm.formState.errors.email.message}</p>
            )}
          </div>
          <div className="grid gap-2">
            <div className="flex items-center">
              <Label htmlFor="login-password">পাসওয়ার্ড</Label>
            </div>
            <Input 
                id="login-password" 
                type="password"
                placeholder="আপনার পাসওয়ার্ড"
                {...loginForm.register("password")} 
            />
            {loginForm.formState.errors.password && (
              <p className="text-xs text-destructive">{loginForm.formState.errors.password.message}</p>
            )}
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? <Loader2 className="animate-spin" /> : "লগইন করুন"}
          </Button>
        </form>
      </TabsContent>
      <TabsContent value="signup">
        <form onSubmit={signupForm.handleSubmit(onSignupSubmit)} className="grid gap-4 mt-4">
            <div className="grid gap-2">
                <Label htmlFor="signup-name">নাম</Label>
                <Input 
                    id="signup-name" 
                    placeholder="আপনার পুরো নাম" 
                    {...signupForm.register("name")}
                />
                 {signupForm.formState.errors.name && (
                    <p className="text-xs text-destructive">{signupForm.formState.errors.name.message}</p>
                )}
            </div>
            <div className="grid gap-2">
                <Label htmlFor="signup-email">ইমেইল</Label>
                <Input
                id="signup-email"
                type="email"
                placeholder="আপনার ইমেইল"
                {...signupForm.register("email")}
                />
                 {signupForm.formState.errors.email && (
                    <p className="text-xs text-destructive">{signupForm.formState.errors.email.message}</p>
                )}
            </div>
            <div className="grid gap-2">
                <Label htmlFor="signup-password">পাসওয়ার্ড</Label>
                <Input 
                    id="signup-password" 
                    type="password" 
                    placeholder="নতুন পাসওয়ার্ড দিন"
                    {...signupForm.register("password")}
                />
                {signupForm.formState.errors.password && (
                    <p className="text-xs text-destructive">{signupForm.formState.errors.password.message}</p>
                )}
            </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? <Loader2 className="animate-spin" /> : "একাউন্ট তৈরি করুন"}
          </Button>
        </form>
      </TabsContent>
    </Tabs>
  )
}
