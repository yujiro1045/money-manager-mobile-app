import React, { useEffect, useState } from "react";
import {
  Dimensions,
  Modal,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { useReanimatedKeyboardAnimation } from "react-native-keyboard-controller";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

const SCREEN_HEIGHT = Dimensions.get("window").height;
const SHEET_MAX_HEIGHT = SCREEN_HEIGHT * 0.85;
const SAFE_TOP_MARGIN = 50;

type Props = {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

export default function AnimatedBottomSheet({
  visible,
  onClose,
  children,
}: Props) {
  const [showModal, setShowModal] = useState(visible);
  const backdropOpacity = useSharedValue(0);
  const translateY = useSharedValue(30);

  // 👇 altura real del sheet, medida en runtime (arranca con un estimado)
  const sheetHeight = useSharedValue(SHEET_MAX_HEIGHT);

  const { height: keyboardHeight } = useReanimatedKeyboardAnimation();

  if (visible && !showModal) {
    setShowModal(true);
  }

  useEffect(() => {
    if (visible) {
      backdropOpacity.value = withTiming(1, { duration: 250 });
      translateY.value = withSpring(0, {
        damping: 20,
        stiffness: 240,
        mass: 0.6,
      });
    } else {
      backdropOpacity.value = withTiming(0, { duration: 200 });
      translateY.value = withTiming(30, { duration: 150 }, (finished) => {
        if (finished) runOnJS(setShowModal)(false);
      });
    }
  }, [visible]);

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value,
  }));

  const sheetStyle = useAnimatedStyle(() => {
    // Posición real del borde superior, basada en la altura MEDIDA, no asumida
    const topPosition = SCREEN_HEIGHT - sheetHeight.value;
    const maxUpwardShift = -(topPosition - SAFE_TOP_MARGIN);
    const clampedKeyboardShift = Math.max(keyboardHeight.value, maxUpwardShift);

    return {
      transform: [{ translateY: translateY.value + clampedKeyboardShift }],
    };
  });

  return (
    <Modal
      visible={showModal}
      transparent
      animationType="slide"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <Animated.View style={[styles.backdropArea, backdropStyle]}>
          <TouchableOpacity
            style={StyleSheet.absoluteFill}
            onPress={onClose}
            activeOpacity={1}
          />
        </Animated.View>
        <Animated.View
          style={[styles.sheet, sheetStyle]}
          onLayout={(e) => {
            // se actualiza cada vez que el contenido cambia de alto
            sheetHeight.value = e.nativeEvent.layout.height;
          }}
        >
          {children}
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backdropArea: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  sheet: {
    backgroundColor: "#FFFFFF",
    maxHeight: SHEET_MAX_HEIGHT,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
});
