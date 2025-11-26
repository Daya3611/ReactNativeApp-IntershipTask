import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { Product } from '../lib/api';

interface SavedContextType {
    savedItems: Product[];
    saveItem: (item: Product) => void;
    unsaveItem: (id: number) => void;
    isSaved: (id: number) => boolean;
}

const SavedContext = createContext<SavedContextType | undefined>(undefined);

export const SavedProvider = ({ children }: { children: ReactNode }) => {
    const [savedItems, setSavedItems] = useState<Product[]>([]);

    useEffect(() => {
        loadSavedItems();
    }, []);

    const loadSavedItems = async () => {
        try {
            const storedItems = await AsyncStorage.getItem('savedItems');
            if (storedItems) {
                setSavedItems(JSON.parse(storedItems));
            }
        } catch (error) {
            console.error('Failed to load saved items:', error);
        }
    };

    const saveItem = async (item: Product) => {
        const newItems = [...savedItems, item];
        setSavedItems(newItems);
        await AsyncStorage.setItem('savedItems', JSON.stringify(newItems));
    };

    const unsaveItem = async (id: number) => {
        const newItems = savedItems.filter((item) => item.id !== id);
        setSavedItems(newItems);
        await AsyncStorage.setItem('savedItems', JSON.stringify(newItems));
    };

    const isSaved = (id: number) => {
        return savedItems.some((item) => item.id === id);
    };

    return (
        <SavedContext.Provider value={{ savedItems, saveItem, unsaveItem, isSaved }}>
            {children}
        </SavedContext.Provider>
    );
};

export const useSaved = () => {
    const context = useContext(SavedContext);
    if (!context) {
        throw new Error('useSaved must be used within a SavedProvider');
    }
    return context;
};
