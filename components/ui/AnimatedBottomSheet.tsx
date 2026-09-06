import React, { useEffect, useState } from "react";
import {
  Dimensions,
  Modal,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import {
  KeyboardAvoidingView,
  useReanimatedKeyboardAnimation,
} from "react-native-keyboard-controller";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

const SCREEN_HEIGHT = Dimensions.get("window").height;
const SHEET_MAX_HEIGHT = SCREEN_HEIGHT * 0.85;
const SHEET_TOP_POSITION = SCREEN_HEIGHT - SHEET_MAX_HEIGHT;
const SAFE_TOP_MARGIN = 10;

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
    // El desplazamiento máximo permitido hacia arriba: que el borde superior
    // del sheet no pase de SAFE_TOP_MARGIN desde el tope de la pantalla.
    const maxUpwardShift = -(SHEET_TOP_POSITION - SAFE_TOP_MARGIN);

    // clamp: usamos el shift del teclado, pero nunca más negativo que el límite
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
        <Animated.View style={[styles.sheet, sheetStyle]}>
          <KeyboardAvoidingView
            behavior="padding"
            style={styles.keyboardAvoiding}
          >
            {children}
          </KeyboardAvoidingView>
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
  },
  keyboardAvoiding: {
    width: "100%",
  },
});
