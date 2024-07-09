declare module 'react-native-vector-icons/Ionicons' {
  import { IconProps } from 'react-native-vector-icons/Icon';
  import { Component } from 'react';

  export default class Icon extends Component<IconProps> {}
}

declare module 'react-native-star-rating' {
  import { Component } from 'react';
  import { ViewStyle, StyleProp } from 'react-native';

  interface StarRatingProps {
      activeOpacity?: number;
      buttonStyle?: StyleProp<ViewStyle>;
      containerStyle?: StyleProp<ViewStyle>;
      disabled?: boolean;
      emptyStar?: string | number | JSX.Element;
      emptyStarColor?: string;
      fullStar?: string | number | JSX.Element;
      fullStarColor?: string;
      halfStar?: string | number | JSX.Element;
      halfStarColor?: string;
      halfStarEnabled?: boolean;
      iconSet?: string;
      maxStars?: number;
      rating?: number;
      reversed?: boolean;
      selectedStar?: (rating: number) => void;
      starSize?: number;
      starStyle?: StyleProp<ViewStyle>;
      animation?: string;
  }

  export default class StarRating extends Component<StarRatingProps> {}
}
