import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface LeaderboardEntry {
    username: string;
    anime_count: number;
}

export default function Leaderboard() {
    const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            const { data, error } = await supabase.rpc('get_leaderboard');
            if (error) {
                console.error('Fetch leaderboard error:', error);
            } else {
                console.log('Fetch leaderboard data:', data);
                setLeaderboard(data);
            }
        }
        fetchLeaderboard();
    }, []);

    return (
        <section className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Top Anime Watchers</CardTitle>
                </CardHeader>
                <CardContent>
                    <table className="w-full text-sm">
                        <thead>
                            <tr>
                                <th className="border-b px-4 py-2 text-left text-muted-foreground font-medium">User</th>
                                <th className="border-b px-4 py-2 text-left text-muted-foreground font-medium">Completed</th>
                            </tr>
                        </thead>
                        <tbody>
                            {leaderboard.map((entry) => (
                                <tr key={entry.username} className="border-b last:border-0">
                                    <td className="px-4 py-3">{entry.username}</td>
                                    <td className="px-4 py-3">{entry.anime_count}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </CardContent>
            </Card>
        </section>
    );
}
