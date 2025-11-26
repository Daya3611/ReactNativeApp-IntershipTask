import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSaved } from '../../context/SavedContext';
import { fetchProducts, Product } from '../../lib/api';
import { calculatePrice } from '../../lib/utils';

export default function DetailScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const { isSaved, saveItem, unsaveItem, savedItems } = useSaved();
    const [product, setProduct] = React.useState<Product | null>(null);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const load = async () => {
            setLoading(true);
            // Try to find in saved items first
            const saved = savedItems.find(p => p.id === Number(id));
            if (saved) {
                setProduct(saved);
                setLoading(false);
                return;
            }
            // Fallback to fetch all products
            const all = await fetchProducts();
            const found = all.find(p => p.id === Number(id));
            if (found) setProduct(found);
            setLoading(false);
        };
        load();
    }, [id, savedItems]);

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#3B82F6" />
            </View>
        );
    }

    if (!product) {
        return (
            <View style={styles.loadingContainer}>
                <Text style={styles.notFoundText}>Product not found.</Text>
            </View>
        );
    }

    const saved = isSaved(product.id);
    const price = calculatePrice(product.title, product.description);

    const handleSave = () => {
        if (saved) unsaveItem(product.id);
        else saveItem(product);
    };

    return (
        <View style={styles.container}>
            <StatusBar style="dark" />
            <ScrollView>
                {/* Product Image */}
                <Animated.Image
                    source={{ uri: product.image }}
                    style={styles.image}
                    entering={FadeIn.duration(500)}
                    resizeMode="contain"
                />

                {/* Content Container */}
                <Animated.View
                    style={styles.contentContainer}
                    entering={FadeInDown.duration(600).delay(200)}
                >
                    {/* Category Badge */}
                    <View style={styles.categoryBadge}>
                        <Text style={styles.categoryText}>{product.category}</Text>
                    </View>

                    {/* Title */}
                    <Text style={styles.title}>{product.title}</Text>

                    {/* Price and Rating Row */}
                    <View style={styles.priceRatingRow}>
                        {/* Price Section */}
                        <View style={styles.priceSection}>
                            <Text style={styles.priceLabel}>Calculated Price</Text>
                            <Text style={styles.price}>{price}</Text>
                        </View>

                        {/* Rating Section */}
                        <View style={styles.ratingSection}>
                            <View style={styles.ratingBadge}>
                                <Text style={styles.starEmoji}>⭐</Text>
                                <Text style={styles.ratingValue}>
                                    {product.rating.rate.toFixed(1)}
                                </Text>
                            </View>
                            <Text style={styles.reviewCount}>
                                {product.rating.count} reviews
                            </Text>
                        </View>
                    </View>

                    {/* Description Section */}
                    <View style={styles.descriptionSection}>
                        <Text style={styles.descriptionLabel}>Description</Text>
                        <Text style={styles.description}>{product.description}</Text>
                    </View>
                </Animated.View>
            </ScrollView>

            {/* Floating Action Buttons */}
            <SafeAreaView
                style={styles.floatingButtonsContainer}
                edges={['top']}
            >
                <TouchableOpacity
                    onPress={() => router.back()}
                    style={styles.floatingButton}
                    activeOpacity={0.8}
                >
                    <Ionicons name="arrow-back" size={24} color="#111827" />
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={handleSave}
                    style={[styles.floatingButton, saved && styles.floatingButtonSaved]}
                    activeOpacity={0.8}
                >
                    <Ionicons
                        name={saved ? 'bookmark' : 'bookmark-outline'}
                        size={24}
                        color={saved ? '#FFFFFF' : '#111827'}
                    />
                </TouchableOpacity>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
    },
    notFoundText: {
        fontSize: 16,
        color: '#6B7280',
    },
    image: {
        width: '100%',
        height: 400,
        backgroundColor: '#F9FAFB',
    },
    contentContainer: {
        padding: 20,
        paddingBottom: 40,
    },
    categoryBadge: {
        alignSelf: 'flex-start',
        backgroundColor: '#EEF2FF',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
        marginBottom: 16,
    },
    categoryText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#4F46E5',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    title: {
        fontSize: 26,
        fontWeight: '800',
        color: '#111827',
        lineHeight: 34,
        marginBottom: 20,
    },
    priceRatingRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 24,
        paddingBottom: 24,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    priceSection: {
        flex: 1,
    },
    priceLabel: {
        fontSize: 12,
        color: '#9CA3AF',
        marginBottom: 4,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    price: {
        fontSize: 32,
        fontWeight: '800',
        color: '#10B981',
    },
    ratingSection: {
        alignItems: 'flex-end',
    },
    ratingBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFBEB',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 10,
        marginBottom: 6,
        borderWidth: 1,
        borderColor: '#FDE68A',
    },
    starEmoji: {
        fontSize: 18,
        marginRight: 6,
    },
    ratingValue: {
        fontSize: 18,
        fontWeight: '700',
        color: '#D97706',
    },
    reviewCount: {
        fontSize: 12,
        color: '#9CA3AF',
    },
    descriptionSection: {
        marginTop: 8,
    },
    descriptionLabel: {
        fontSize: 14,
        fontWeight: '700',
        color: '#111827',
        marginBottom: 12,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    description: {
        fontSize: 16,
        color: '#4B5563',
        lineHeight: 26,
    },
    floatingButtonsContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 16,
    },
    floatingButton: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 5,
    },
    floatingButtonSaved: {
        backgroundColor: '#3B82F6',
    },
});
