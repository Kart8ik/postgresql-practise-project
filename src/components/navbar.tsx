import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";


export default function Navbar() {
    const [isDark, setIsDark] = useState<boolean>(false);
    useEffect(() => {
        try {
            const stored = localStorage.getItem("theme");
            const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
            const initial = stored ? stored === "dark" : prefersDark;
            setIsDark(initial);
            if (initial) document.documentElement.classList.add("dark");
            else document.documentElement.classList.remove("dark");
        } catch {}
    }, []);

    const toggleTheme = () => {
        const next = !isDark;
        setIsDark(next);
        try {
            localStorage.setItem("theme", next ? "dark" : "light");
        } catch {}
        if (next) document.documentElement.classList.add("dark");
        else document.documentElement.classList.remove("dark");
    };

    const handleLogout = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
            console.error('Logout error:', error);
            toast.error("Logout failed");
        } else {
            toast.success("Logout successful");
        }
    }
    return (
        <header className="border-b bg-background">
            <div className="container mx-auto flex items-center justify-between px-4 py-3">
                <h1 className="text-lg font-semibold">Anime Tracker</h1>
                <nav className="flex items-center gap-4">
                    <Link to="/" className="text-sm font-medium hover:text-primary">My List</Link>
                    <Link to="/leaderboard" className="text-sm font-medium hover:text-primary">Leaderboard</Link>
                    <Button variant="outline" size="sm" onClick={toggleTheme}>{isDark ? "Light" : "Dark"}</Button>
                    <Button variant="secondary" size="sm" onClick={handleLogout}>Logout</Button>
                </nav>
            </div>
        </header>
    );
}
