import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import type { FormEvent } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

export default function AnimeForm({ anime, setAnime }: { anime: any, setAnime: (anime: any) => void }) {
    const [formData, setFormData] = useState({
        title: "",
        genre: "",
        personal_rating: 0,
        status: "",
    });

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        const title = formData.title.trim();
        const genre = formData.genre.trim();
        const status = formData.status;
        const rating = Number(formData.personal_rating);

        if (!title) {
            toast.error('Title is required');
            return;
        }
        if (!genre) {
            toast.error('Genre is required');
            return;
        }
        if (!status) {
            toast.error('Status is required');
            return;
        }
        if (!Number.isFinite(rating) || rating < 0 || rating > 10) {
            toast.error('Rating must be between 0 and 10');
            return;
        }

        // console.log({ title, genre, status, personal_rating: rating });
        const { data: _insertAnime, error } = await supabase.from('anime_list').insert({
            title,
            genre,
            personal_rating: rating,
            status
        });
        if (error) {
            console.error('Add anime error:', error);
            toast.error('Failed to add anime');
            setFormData({
                title: "",
                genre: "",
                personal_rating: 0,
                status: "",
            });
        } else {
            // console.log('Add anime data:', _insertAnime);
            toast.success('Anime added successfully');
            setAnime([...anime, { title, genre, personal_rating: rating, status }]);
            setFormData({
                title: "",
                genre: "",
                personal_rating: 0,
                status: "",
            });
            
        }
    };

    return (
        <form className="grid gap-4" onSubmit={handleSubmit}>
            <div className="grid gap-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" placeholder="Anime title..." value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="genre">Genre</Label>
                <Input id="genre" placeholder="Genre..." value={formData.genre} onChange={(e) => setFormData({ ...formData, genre: e.target.value })} />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="personal-rating">Personal Rating</Label>
                <Input
                    id="personal-rating"
                    type="number"
                    min={0}
                    max={10}
                    step={1}
                    placeholder="Personal rating..."
                    value={formData.personal_rating}
                    onChange={(e) =>
                        setFormData({
                            ...formData,
                            personal_rating: Math.max(0, Math.min(10, Number(e.target.value) || 0)),
                        })
                    }
                />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select status..." />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="watching">Watching</SelectItem>
                        <SelectItem value="on-hold">On Hold</SelectItem>
                        <SelectItem value="dropped">Dropped</SelectItem>
                        <SelectItem value="plan-to-watch">Plan to Watch</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <Button type="submit" >Add Anime</Button>
        </form>
    );
}
