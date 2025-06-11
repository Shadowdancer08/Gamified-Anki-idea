import React, { useEffect } from 'react';
import Svg, { Circle } from 'react-native-svg';
import Animated, { useSharedValue, withTiming, useAnimatedProps, runOnJS } from 'react-native-reanimated';
import { colors } from '../styles/theme';

interface Props {
  duration?: number;
  size?: number;
  strokeWidth?: number;
  onComplete?: () => void;
}

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export const ProgressRing: React.FC<Props> = ({ duration = 60000, size = 80, strokeWidth = 8, onComplete }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withTiming(1, { duration }, () => {
      if (onComplete) runOnJS(onComplete)();
    });
  }, []);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: circumference * (1 - progress.value),
  }));

  return (
    <Svg width={size} height={size}>
      <Circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke={colors.card}
        strokeWidth={strokeWidth}
        fill="none"
        opacity={0.2}
      />
      <AnimatedCircle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke={colors.accent}
        strokeWidth={strokeWidth}
        fill="none"
        strokeDasharray={`${circumference}`}
        animatedProps={animatedProps}
      />
    </Svg>
  );
};
