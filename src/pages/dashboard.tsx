import AnimeForm from "@/components/anime-form";
import AnimeCard from "@/components/anime-card";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/Context";

export default function Dashboard() {
    const { user } = useAuth();
    const [anime, setAnime] = useState<any[]>([]);

    const upsertUser = async () => {
        console.log('Upserting user:', user.user_metadata.username);
        const {data: userData, error: userError} = await supabase.from('users').select('*').eq('user_id', user.id);
        if (userError) {
            console.error('Fetch user error:', userError);
        } else if (userData.length === 0) {
            console.log('Fetch user data:', userData);
            const { data: insertData, error: insertError } = await supabase.from('users').upsert({
                username: user.user_metadata.username,
            });
            if (insertError) {
                console.error('Insert error:', insertError);
            } else {
                console.log('Insert data:', insertData);
            }
        }
    }

    useEffect(() => {
        upsertUser();
        const fetchAnime = async () => {
            console.log('Fetching anime for user:', user);
            const { data, error } = await supabase.from('anime_list').select('*').eq('user_id', user.id).order('title', { ascending: true });
            if (error) {
                console.error('Fetch anime error:', error);
                toast.error('Failed to fetch anime');
            } else {
                console.log('Fetch anime data:', data);
                toast.success('Anime fetched successfully');
                setAnime(data);
            }
        }
        fetchAnime();
    }, []);

    return (
        <section className="space-y-6">
            <h2 className="text-2xl font-semibold tracking-tight">My Anime List</h2>
            <AnimeForm anime={anime} setAnime={setAnime} />
            <div className="flex flex-col gap-4">
                {anime.map((anime) => (
                    <AnimeCard key={anime.title} title={anime.title} status={anime.status} genre={anime.genre} personalRating={anime.personal_rating} setAnime={setAnime} />
                ))}
            </div>
        </section>
    );
}
