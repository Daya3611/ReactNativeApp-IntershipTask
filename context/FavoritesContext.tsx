import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect } from "react";

export interface Item {
    id: string;
    name: string;
    description: string;
    image: string;
    price: string;
    originalPrice: string;
}

export interface FavoritesContextType {
    favorites: Item[];
    toggleFavorite: (item: Item) => void;
    isFavorite: (itemId: string) => boolean;
}

const FavoritesContext = React.createContext<FavoritesContextType | null>(null);

export const FavoritesProvider = ({ children }: { children: React.ReactNode }) => {
    const [favorites, setFavorites] = React.useState<Item[]>([]);
    const STORAGE_KEY = "@saved_favorites";

    useEffect(() => {
        const load = async () => {
            try {
                const saved = await AsyncStorage.getItem(STORAGE_KEY);
                if (saved) {
                    setFavorites(JSON.parse(saved));
                }

            } catch (error) {
                console.error("Failed to load favorites from storage", error);
            }
        };
        load();
    }, []);

    useEffect(() => {
        AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(favorites))
    }, [favorites])

        const toggleFavorite = (item: Item) => {
            setFavorites((prev) =>
                prev.some((fav) => fav.id === item.id)
                    ? prev.filter(fav => fav.id !== item.id)
                    : [...prev, item]
            );
        };
    
    
        const isFavorite = (itemId: string) => {
            return favorites.some((fav) => fav.id === itemId);
        };
    
        return (
            <FavoritesContext.Provider
                value={{ favorites, toggleFavorite, isFavorite }}
            >
                {children}
            </FavoritesContext.Provider>
        );
    };
    
    export default FavoritesContext;