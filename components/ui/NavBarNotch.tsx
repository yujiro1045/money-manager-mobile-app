import { Dimensions } from "react-native";
import Svg, { Path } from "react-native-svg";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
export const BAR_WIDTH = SCREEN_WIDTH * 0.92;
export const BAR_HEIGHT = 70;
export const NOTCH_RADIUS = 24;
export const CORNER_RADIUS = 30;

function buildNotchPath(w: number, h: number, nr: number, cr: number): string {
  const cx = w / 2;
  const notchLeft = cx - nr - 60;
  const notchRight = cx + nr + 60;

  return [
    `M ${cr} 0`,
    `L ${notchLeft} 0`,
    `Q ${cx - nr} 0 ${cx - nr} ${nr}`,
    `A ${nr * 2} ${nr} 0 0 0 ${cx + nr} ${nr}`,
    `Q ${cx + nr} 0 ${notchRight} 0`,
    `L ${w - cr} 0`,
    `Q ${w} 0 ${w} ${cr}`,
    `L ${w} ${h - cr}`,
    `Q ${w} ${h} ${w - cr} ${h}`,
    `L ${cr} ${h}`,
    `Q 0 ${h} 0 ${h - cr}`,
    `L 0 ${cr}`,
    `Q 0 0 ${cr} 0`,
    `Z`,
  ].join(" ");
}

interface NavBarNotchProps {
  color: string;
}

const NavBarNotch: React.FC<NavBarNotchProps> = ({ color }) => {
  const path = buildNotchPath(
    BAR_WIDTH,
    BAR_HEIGHT,
    NOTCH_RADIUS,
    CORNER_RADIUS,
  );

  return (
    <Svg width={BAR_WIDTH} height={BAR_HEIGHT}>
      <Path d={path} fill={color} />
    </Svg>
  );
};

export default NavBarNotch;
