import React from 'react';
import { Dimensions } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming,
} from 'react-native-reanimated';

interface SwipeableItemProps {
    children: React.ReactNode;
    onDelete: () => void;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const TRANSLATE_X_THRESHOLD = -SCREEN_WIDTH * 0.3;

export default function SwipeableItem({ children, onDelete }: SwipeableItemProps) {
    const translateX = useSharedValue(0);
    const itemHeight = useSharedValue<number | undefined>(undefined);
    const opacity = useSharedValue(1);

    const panGesture = Gesture.Pan()
        .onUpdate((event) => {
            translateX.value = event.translationX;
        })
        .onEnd(() => {
            const shouldDismiss = translateX.value < TRANSLATE_X_THRESHOLD;
            if (shouldDismiss) {
                translateX.value = withTiming(-SCREEN_WIDTH, undefined, (isFinished) => {
                    if (isFinished) {
                        runOnJS(onDelete)();
                    }
                });
                itemHeight.value = withTiming(0);
                opacity.value = withTiming(0);
            } else {
                translateX.value = withSpring(0);
            }
        });

    const rStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: translateX.value }],
    }));

    const rContainerStyle = useAnimatedStyle(() => {
        return {
            height: itemHeight.value,
            opacity: opacity.value,
            marginBottom: itemHeight.value === 0 ? 0 : 16, // Adjust margin as needed
        };
    });

    return (
        <Animated.View style={rContainerStyle}>
            <GestureDetector gesture={panGesture}>
                <Animated.View style={rStyle}>
                    {children}
                </Animated.View>
            </GestureDetector>
        </Animated.View>
    );
}
