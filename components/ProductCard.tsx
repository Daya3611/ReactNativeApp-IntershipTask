import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSaved } from '../context/SavedContext';
import { Product } from '../lib/api';
import { calculatePrice, isPrime } from '../lib/utils';
import SwipeableItem from './SwipeableItem';

interface ProductCardProps {
  product: Product;
  index: number;
  onDelete?: () => void;
  isSavedView?: boolean;
}

// Separate component for the card content to keep the main component tidy
const CardContent = ({
  product,
  index,
  saved,
  handleSave,
  isPrimeIndex,
  price,
  isSavedView,
}: {
  product: Product;
  index: number;
  saved: boolean;
  handleSave: () => void;
  isPrimeIndex: boolean;
  price: string;
  isSavedView: boolean;
}) => (
  <Link href={{ pathname: '/detail/[id]', params: { id: product.id } }} asChild>
    <TouchableOpacity style={styles.card} activeOpacity={0.7}>
      {/* Prime Badge - Positioned Absolutely */}
      {isPrimeIndex && !isSavedView && (
        <View style={styles.primeBadge}>
          <Text style={styles.primeEmoji}>👑</Text>
        </View>
      )}

      {/* Bookmark Button - Top Right */}
      <TouchableOpacity
        onPress={handleSave}
        style={styles.bookmarkButton}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <View style={[styles.bookmarkCircle, saved && styles.bookmarkCircleSaved]}>
          <Ionicons
            name={saved ? 'bookmark' : 'bookmark-outline'}
            size={20}
            color={saved ? '#FFFFFF' : '#6B7280'}
          />
        </View>
      </TouchableOpacity>

      {/* Product Image Container */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: product.image }}
          style={styles.image}
          resizeMode="contain"
        />
      </View>

      {/* Content Section */}
      <View style={styles.contentSection}>
        {/* Category Badge */}
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>{product.category}</Text>
        </View>

        {/* Title */}
        <Text style={styles.title} numberOfLines={2}>
          {product.title}
        </Text>

        {/* Description */}
        <Text style={styles.description} numberOfLines={2}>
          {product.description}
        </Text>

        {/* Footer with Price and Rating */}
        <View style={styles.footer}>
          <View style={styles.priceContainer}>
            <Text style={styles.priceLabel}>Price</Text>
            <Text style={styles.price}>{price}</Text>
          </View>

          <View style={styles.ratingContainer}>
            <View style={styles.ratingBadge}>
              <Text style={styles.starEmoji}>⭐</Text>
              <Text style={styles.ratingText}>
                {product.rating.rate.toFixed(1)}
              </Text>
            </View>
            <Text style={styles.reviewCount}>
              {product.rating.count} reviews
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  </Link>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    overflow: 'hidden',
  },
  primeBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    zIndex: 10,
    backgroundColor: '#FEF3C7',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1.5,
    borderColor: '#F59E0B',
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  primeEmoji: {
    fontSize: 18,
  },
  bookmarkButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    zIndex: 10,
  },
  bookmarkCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  bookmarkCircleSaved: {
    backgroundColor: '#3B82F6',
  },
  imageContainer: {
    width: '100%',
    height: 220,
    backgroundColor: '#F9FAFB',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  contentSection: {
    padding: 16,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 10,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#4F46E5',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
    lineHeight: 24,
  },
  description: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  priceContainer: {
    flex: 1,
  },
  priceLabel: {
    fontSize: 11,
    color: '#9CA3AF',
    marginBottom: 2,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  price: {
    fontSize: 24,
    fontWeight: '800',
    color: '#10B981',
  },
  ratingContainer: {
    alignItems: 'flex-end',
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFBEB',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    marginBottom: 4,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  starEmoji: {
    fontSize: 14,
    marginRight: 4,
  },
  ratingText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#D97706',
  },
  reviewCount: {
    fontSize: 11,
    color: '#9CA3AF',
  },
});

export default function ProductCard({
  product,
  index,
  onDelete,
  isSavedView = false,
}: ProductCardProps) {
  const { isSaved, saveItem, unsaveItem } = useSaved();
  const saved = isSaved(product.id);
  const isPrimeIndex = isPrime(index);
  const price = calculatePrice(product.title, product.description);

  const handleSave = () => {
    if (saved) {
      unsaveItem(product.id);
    } else {
      saveItem(product);
    }
  };

  // If we are rendering the saved view or there is no delete handler, just show the card content.
  if (isSavedView || !onDelete) {
    return (
      <View style={{ marginBottom: 0 }}>
        <CardContent
          product={product}
          index={index}
          saved={saved}
          handleSave={handleSave}
          isPrimeIndex={isPrimeIndex}
          price={price}
          isSavedView={isSavedView}
        />
      </View>
    );
  }

  // Otherwise wrap the card in a swipeable container that provides delete functionality.
  return (
    <SwipeableItem onDelete={onDelete}>
      <CardContent
        product={product}
        index={index}
        saved={saved}
        handleSave={handleSave}
        isPrimeIndex={isPrimeIndex}
        price={price}
        isSavedView={isSavedView}
      />
    </SwipeableItem>
  );
}
