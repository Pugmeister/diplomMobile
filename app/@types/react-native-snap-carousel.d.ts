declare module 'react-native-snap-carousel' {
    import * as React from 'react';
    import { FlatListProps, ViewStyle, StyleProp, ImageURISource } from 'react-native';

    export interface CarouselProps<T> extends Omit<FlatListProps<T>, 'data' | 'renderItem'> {
        data: T[];
        renderItem: (item: { item: T; index: number }, parallaxProps?: any) => React.ReactNode;
        sliderWidth: number;
        itemWidth: number;
        inactiveSlideScale?: number;
        inactiveSlideOpacity?: number;
        loop?: boolean;
        autoplay?: boolean;
        autoplayDelay?: number;
        autoplayInterval?: number;
        enableMomentum?: boolean;
        lockScrollWhileSnapping?: boolean;
        onSnapToItem?: (index: number) => void;
        layout?: 'default' | 'stack' | 'tinder';
        layoutCardOffset?: number;
        containerCustomStyle?: StyleProp<ViewStyle>;
        contentContainerCustomStyle?: StyleProp<ViewStyle>;
        scrollInterpolator?: (index: number, carouselProps: CarouselProps<T>) => { inputRange: number[]; outputRange: number[] };
        slideInterpolatedStyle?: (index: number, animatedValue: any, carouselProps: CarouselProps<T>) => ViewStyle;
    }

    export default class Carousel<T> extends React.Component<CarouselProps<T>> {}
}
