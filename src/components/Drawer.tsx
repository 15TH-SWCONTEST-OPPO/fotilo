import {
  View,
  Text,
  ViewStyle,
  PressableProps,
  Pressable,
  StyleSheet,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';

interface DrawerProps extends PressableProps {
  position?: 'top' | 'bottom' | 'left' | 'right';
  style?: ViewStyle;
  drawers?: any;
  children?: any;
  showDrawer?: boolean;
}

export default function Drawer(props: DrawerProps) {
  const [size, setSize] = useState({height: 0, width: 0});

  const {position, children, drawers, style, showDrawer} = props;

  const [show, setShow] = useState<boolean>(false);

  // drawer位置
  const side = {
    top: {bottom: size.height},
    bottom: {top: size.height},
    left: {right: size.width},
    right: {left: size.width},
  };

  useEffect(() => {
    if (showDrawer !== undefined && !showDrawer) setShow(false);
  });

  return (
    <View>
      {show && (
        <Pressable style={{...styles.drawers, ...side[position || 'bottom']}}>
          {drawers}
        </Pressable>
      )}
      <Pressable
        onLayout={e => {
          setSize({
            height: e.nativeEvent.layout.height,
            width: e.nativeEvent.layout.width,
          });
        }}
        style={{...style}}
        onPress={() => {
          setShow(!show);
          console.log(123);
        }}>
        {children ? (
          typeof children === 'string' ? (
            <Text>{children}</Text>
          ) : (
            <>{children}</>
          )
        ) : (
          'hello world'
        )}
      </Pressable>
    </View>
  );
}

Drawer.defaultProps = {
  position: 'bottom',
  showDrawer: false,
};

const styles = StyleSheet.create({
  drawers: {
    position: 'absolute',
    zIndex: 99999,
  },
});
