import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withDelay,
    withSequence,
    withSpring,
    withTiming
} from 'react-native-reanimated';

const PARTICLE_COUNT = 8;

const Particle = ({ active, index }: { active: boolean; index: number }) => {
    const angle = (index * 2 * Math.PI) / PARTICLE_COUNT;
    const radius = 60;

    const x = useSharedValue(0);
    const y = useSharedValue(0);
    const opacity = useSharedValue(0);
    const scale = useSharedValue(0);

    React.useEffect(() => {
        if (active) {
            x.value = 0;
            y.value = 0;
            opacity.value = 1;
            scale.value = 1;

            x.value = withTiming(Math.cos(angle) * radius, { duration: 600, easing: Easing.out(Easing.exp) });
            y.value = withTiming(Math.sin(angle) * radius, { duration: 600, easing: Easing.out(Easing.exp) });
            opacity.value = withDelay(300, withTiming(0, { duration: 300 }));
            scale.value = withDelay(300, withTiming(0, { duration: 300 }));
        }
    }, [active]);

    const style = useAnimatedStyle(() => ({
        transform: [{ translateX: x.value }, { translateY: y.value }, { scale: scale.value }],
        opacity: opacity.value,
    }));

    return (
        <Animated.View style={[styles.particle, style]}>
            <View style={styles.dot} />
        </Animated.View>
    );
};

export default function CreativeSpark() {
    const [active, setActive] = useState(false);
    const scale = useSharedValue(1);

    const handlePress = () => {
        setActive(true);
        scale.value = withSequence(
            withSpring(0.8),
            withSpring(1.2),
            withSpring(1)
        );

        
        setTimeout(() => setActive(false), 1000);
    };

    const buttonStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    return (
        <View style={styles.container}>
            {Array.from({ length: PARTICLE_COUNT }).map((_, i) => (
                <Particle key={i} active={active} index={i} />
            ))}

            <TouchableOpacity onPress={handlePress} activeOpacity={1}>
                <Animated.View style={[styles.button, buttonStyle]}>
                    <Ionicons name="sparkles" size={24} color="white" />
                </Animated.View>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    button: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#8B5CF6', 
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#8B5CF6',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    particle: {
        position: 'absolute',
        width: 10,
        height: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#F472B6', 
    },
});
