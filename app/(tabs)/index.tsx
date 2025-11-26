import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CreativeSpark from '../../components/CreativeSpark';
import ProductCard from '../../components/ProductCard';
import { fetchProducts, Product } from '../../lib/api';

export default function FeedScreen() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        setLoading(true);
        const data = await fetchProducts();
        setProducts(data);
        setLoading(false);
    };

    const handleDelete = (id: number) => {
        setProducts(prev => prev.filter(item => item.id !== id));
    };

    if (loading) {
        return (
            <View className="flex-1 justify-center items-center bg-white">
                <ActivityIndicator size="large" color="#007AFF" />
            </View>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-gray-50" edges={['bottom', 'left', 'right']}>
            <StatusBar style="dark" />
            <FlatList
                data={products}
                keyExtractor={item => item.id.toString()}
                renderItem={({ item, index }) => (
                    <ProductCard product={item} index={index} onDelete={() => handleDelete(item.id)} />
                )}
                contentContainerStyle={{ padding: 16 }}
            />
            <View className="absolute bottom-6 right-6">
                <CreativeSpark />
            </View>
        </SafeAreaView>
    );
}
