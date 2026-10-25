import { useEffect } from 'react';
import { Easing, useSharedValue, withTiming, type SharedValue } from 'react-native-reanimated';
import type { AnimationProps } from './types';

/**
 * Entry progress 0→1 driven by Reanimated on the UI thread.
 * Charts consume it in worklets / Skia props, so no JS-thread frame loop exists.
 */
export function useProgress({ duration = 700, animate = true }: AnimationProps, deps: readonly unknown[] = []): SharedValue<number> {
  const p = useSharedValue(animate ? 0 : 1);
  useEffect(() => {
    if (!animate) { p.value = 1; return; }
    p.value = 0;
    p.value = withTiming(1, { duration, easing: Easing.out(Easing.cubic) });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  return p;
}

/** Tween a numeric value on the UI thread whenever `target` changes. */
export function useAnimatedNumber(target: number, { duration = 700, animate = true }: AnimationProps): SharedValue<number> {
  const v = useSharedValue(animate ? 0 : target);
  useEffect(() => {
    v.value = animate ? withTiming(target, { duration, easing: Easing.out(Easing.cubic) }) : target;
  }, [target, duration, animate, v]);
  return v;
}
