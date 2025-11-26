import { Item } from '@/context/FavoritesContext'
import { calculatePrice, isPrime } from '@/lib/logic'
import React, { useEffect, useState } from 'react'
import { ActivityIndicator, FlatList, View } from 'react-native'

export default function FeedScreen() {

    const [data, setData] = useState<Item[]>([])
    const [loading, setLoading] = useState<boolean>(true)

    useEffect(() => {
        loadData()
    },[])

    const loadData = async () => {
        try {
            const response = await fetch('https://dummyjson.com/recipes?limit=30')
            const json = await response.json();

            const mapped = json.recipes.map((item: any, index: number) => ({
                id: item.id,
                name: item.name,
                description: Array.isArray(item.instructions) ? item.instructions.join(" ") : String(item.instructions || ""),
                image: item.image,
                originalIndex: index,
                price: calculatePrice(
                    item.name,
                    Array.isArray(item.instructions) ? item.instructions.join(" ") : String(item.instructions || "")
                ),
            }));

            setData(mapped);
        } catch (error) {
            console.error("Failed to load data", error);
        } finally {
            setLoading(false);
        }
    }

    const handelDelete = (id: string) => {
        setData(prev => prev.filter(item => item.id !== id))
    }

    if (loading) {
    return (
        <View className='flex-1 items-center justify-center'>
            <ActivityIndicator size="large" color="#0000ff" />
            
        </View>
    )
    }

  return (
    <View className='flex-1 bg-gray-100'>
        <FlatList
        data={data}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => (
          <ProductCard
            item={item}
            isPrime={isPrime(item.originalIndex)}
            onDelete={() => handleDelete(item.id)}
            onPress={() => navigation.navigate("Detail", { item })}
          />
        )}
      />
    </View>
  )
}


