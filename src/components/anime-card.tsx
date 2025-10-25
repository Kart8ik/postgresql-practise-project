import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { useAuth } from "@/Context";
interface AnimeCardProps {
    title: string;
    status: string;
    genre: string;
    personalRating: number;
    setAnime: (anime: any) => void;
}

export default function AnimeCard({ title, status, genre, personalRating, setAnime }: AnimeCardProps) {
    const { user } = useAuth();
    const handleDelete = async (title: string) => {
        // console.log('Deleting anime:', title, 'User ID:', user.id);
        const { data: _deleted, error } = await supabase.from('anime_list').delete().eq('title', title).eq('user_id', user.id);
        if (error) {
            console.error('Delete anime error:', error);
            toast.error('Failed to delete anime');
        } else {
            // console.log('Delete anime data:', data);
            toast.success('Anime deleted successfully');
            setAnime((prev: any[]) =>
                prev.filter(a => a.title !== title)
            )
        }
    }
    return (
        <Card>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex items-center justify-between gap-4">
                    <Badge>{status}</Badge>
                    <Badge variant="outline">{genre}</Badge>
                    <p>Personal Rating: {personalRating}/10</p>
                </div>
            </CardContent>
            <CardFooter className="gap-2">
                <Button variant="destructive" size="sm" onClick={() => handleDelete(title)}>
                    Delete
                </Button>
            </CardFooter>
        </Card>
    );
}
