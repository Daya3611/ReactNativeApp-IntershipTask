import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { FlatList, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ProductCard from '../../components/ProductCard';
import { useSaved } from '../../context/SavedContext';

export default function SavedScreen() {
    const { savedItems } = useSaved();

    return (
        <SafeAreaView className="flex-1 bg-gray-50" edges={['bottom', 'left', 'right']}>
            <StatusBar style="dark" />
            {savedItems.length === 0 ? (
                <View className="flex-1 justify-center items-center">
                    <Text className="text-gray-500 text-lg">No saved items yet.</Text>
                </View>
            ) : (
                <FlatList
                    data={savedItems}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item, index }) => (
                        <ProductCard
                            product={item}
                            index={index}
                            isSavedView
                        />
                    )}
                    contentContainerStyle={{ padding: 16 }}
                />
            )}
        </SafeAreaView>
    );
}
