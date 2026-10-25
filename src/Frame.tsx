import React, { type ReactNode } from 'react';
import { Canvas, Fill } from '@shopify/react-native-skia';
import type { ViewStyle } from 'react-native';

export interface FrameProps { width: number; height: number; background?: string; style?: ViewStyle; children: ReactNode }
export function Frame({ width, height, background, style, children }: FrameProps): React.JSX.Element {
  return (
    <Canvas style={[{ width, height }, style]}>
      {background ? <Fill color={background} /> : null}
      {children}
    </Canvas>
  );
}
