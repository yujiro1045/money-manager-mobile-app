import React, { useEffect, useState } from "react";
import { Modal, StyleSheet, TouchableOpacity, View } from "react-native";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

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

  useEffect(() => {
    if (visible) {
      setShowModal(true);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value,
  }));

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

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
  sheet: {},
});
