import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

export default function Login() {
    const [userData, setUserData] = useState({ username: '', email: '', password: '' });
    const [isSignUp, setIsSignUp] = useState(false);

    

    const handleSignUp = async () => {
        console.log(userData);
        const { data, error } = await supabase.auth.signUp({
            email: userData.email,
            password: userData.password,
            options: {
                data: {
                    username: userData.username,
                },
            },
        });

        if (error) {
            console.error('Sign up error:', error);
            toast.error(error.message);
        } else {
            console.log('Sign up data:', data);
            toast.success("Sign up successful");
        }
    }

    const handleLogin = async () => {
        console.log(userData);
        const { data, error } = await supabase.auth.signInWithPassword({
            email: userData.email,
            password: userData.password,
        });
        if (error) {
            console.error('Login error:', error);
            toast.error(error.message);
        } else {
            console.log('Login data:', data);
            toast.success("Login successful");
        }
    }

    return (
        <section className="grid min-h-[100dvh] place-items-center px-4 py-12">
            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle>Welcome to Anime Tracker</CardTitle>
                    <div className="flex w-full flex-row gap-2">
                    <Button variant="outline" onClick={() => setIsSignUp(true)}>Sign up</Button>
                    <Button variant="outline" onClick={() => setIsSignUp(false)}>Login</Button>
                    </div>
                </CardHeader>
                <CardContent className="flex flex-col gap-3">
                    {isSignUp && <Input type="text" placeholder="Username" value={userData.username} onChange={(e) => setUserData({ ...userData, username: e.target.value })} />}
                    <Input type="email" placeholder="Email" value={userData.email} onChange={(e) => setUserData({ ...userData, email: e.target.value })} />
                    <Input type="password" placeholder="Password"  value={userData.password} onChange={(e) => setUserData({ ...userData, password: e.target.value })} />
                    <Button type="submit" onClick={isSignUp ? handleSignUp : handleLogin}>{isSignUp ? "Sign up" : "Login"}</Button>
                </CardContent>
            </Card>
        </section>
    );
}
