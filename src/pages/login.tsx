import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import background from "@/assets/background.jpg";

export default function Login() {
    const [userData, setUserData] = useState({ username: '', email: '', password: '' });
    const [isSignUp, setIsSignUp] = useState(false);

    
    useEffect(() => {
        const prevOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = prevOverflow || '';
        };
    }, []);

    const handleSignUp = async () => {
        // console.log(userData);
        const username = userData.username.trim();
        const email = userData.email.trim();
        const password = userData.password;

        const isValidEmail = (value: string) => /[^\s@]+@[^\s@]+\.[^\s@]+/.test(value);
        const isValidUsername = (value: string) => /^[a-zA-Z0-9_]{3,24}$/.test(value);
        const isValidPassword = (value: string) => value.length >= 6;

        if (!isValidUsername(username)) {
            toast.error('Username must be 3-24 chars (letters, numbers, _)');
            return;
        }
        if (!isValidEmail(email)) {
            toast.error('Enter a valid email');
            return;
        }
        if (!isValidPassword(password)) {
            toast.error('Password must be at least 6 characters');
            return;
        }

        const { data: _signUpData, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    username,
                },
            },
        });

        if (error) {
            console.error('Sign up error:', error);
            toast.error(error.message);
        } else {
            // console.log('Sign up data:', _signUpData);
            toast.success("Sign up successful");
        }
    }

    const handleLogin = async () => {
        // console.log(userData);
        const email = userData.email.trim();
        const password = userData.password;

        const isValidEmail = (value: string) => /[^\s@]+@[^\s@]+\.[^\s@]+/.test(value);
        if (!isValidEmail(email)) {
            toast.error('Enter a valid email');
            return;
        }
        if (password.length < 6) {
            toast.error('Password must be at least 6 characters');
            return;
        }

        const { data: _loginData, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        if (error) {
            console.error('Login error:', error);
            toast.error(error.message);
        } else {
            // console.log('Login data:', _loginData);
            toast.success("Login successful");
        }
    }

    return (
        <section className="relative grid h-screen w-screen place-items-center overflow-hidden bg-cover bg-no-repeat"
            style={{
                backgroundImage: `url(${background})`,
            }}
        >
            <div className="absolute inset-0 bg-black/60" />
            <Card className="relative z-10 w-full max-w-sm text-center">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold mb-4">Welcome to Anime Tracker</CardTitle>
                    <div className="flex w-full flex-row align-middle justify-center gap-4">
                    <Button variant="outline" onClick={() => setIsSignUp(true)}>Sign up</Button>
                    <Button variant="outline" onClick={() => setIsSignUp(false)}>Login</Button>
                    </div>
                </CardHeader>
                <CardContent className="flex flex-col gap-3">
                    {isSignUp && <Input type="text" placeholder="Username" autoComplete="username" required={isSignUp} value={userData.username} onChange={(e) => setUserData({ ...userData, username: e.target.value })} />}
                    <Input type="email" placeholder="Email" autoComplete="email" required value={userData.email} onChange={(e) => setUserData({ ...userData, email: e.target.value })} />
                    <Input type="password" placeholder="Password" autoComplete="current-password" minLength={6} required value={userData.password} onChange={(e) => setUserData({ ...userData, password: e.target.value })} />
                    <Button type="submit" onClick={isSignUp ? handleSignUp : handleLogin}>{isSignUp ? "Sign up" : "Login"}</Button>
                </CardContent>
            </Card>
        </section>
    );
}
