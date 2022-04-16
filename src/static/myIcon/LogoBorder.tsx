import React from 'react';
import {createIcon, Icon} from 'native-base';
import Svg, {
  Circle,
  Ellipse,
  G,
  Line,
  Mask,
  Path,
  Rect,
} from 'react-native-svg';

interface IconProps {
  size?: number | string;
  color?: string;
  opacity?: number | string;
}
export const LogoBorder = (props: IconProps) => {
  const {opacity, size, color} = props;
  const CustomIcon = createIcon({
    viewBox: '0 0 62 53',
    path: [
      <>
        <Path
          d="M42.5474 49.8775L35.9337 51.3486C34.4699 50.9912 33.2549 50.5852 32.0602 50.186C31.5123 50.003 30.9686 49.8213 30.4072 49.6465C28.5807 49.0775 26.6932 48.6283 24.2114 48.6001C21.6039 48.5704 19.6156 49.0199 17.6902 49.603C17.0985 49.7822 16.5253 49.9693 15.9475 50.1578C14.6845 50.5701 13.4 50.9894 11.8528 51.3486L5.78613 49.9279C2.98244 49.2714 1 46.7709 1 43.8913V19.6C1 16.1759 3.77584 13.4 7.2 13.4H41.2C44.6242 13.4 47.4 16.1759 47.4 19.6V43.8256C47.4 46.7313 45.3834 49.2466 42.5474 49.8775Z"
          stroke={color||'white'}
          stroke-width="2"
        />
        <Path
          d="M52.1626 24.96L59.603 21.7515C60.2631 21.4668 60.999 21.9508 60.999 22.6697V38.2599C60.999 39.015 60.1941 39.4977 59.528 39.142L52.0876 35.1696C51.762 34.9957 51.5586 34.6566 51.5586 34.2874V25.8783C51.5586 25.479 51.796 25.1181 52.1626 24.96Z"
          stroke={color||'white'}
          stroke-width="2"
        />
        <Circle cx="32.9988" cy="6.2" r="5.2" stroke={color||'white'} stroke-width="2" />
        <Circle cx="13.7996" cy="6.2" r="5.2" stroke={color||'white'} stroke-width="2" />
        <Circle cx="15.3238" cy="6.97495" r="1.525" fill={color||'white'} />
        <Circle cx="34.525" cy="6.97495" r="1.525" fill={color||'white'} />
      </>,
    ],
  });
  return <CustomIcon size={size} opacity={opacity} />;
};
