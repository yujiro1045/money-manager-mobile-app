import { LinearGradient } from "expo-linear-gradient";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Image,
  StyleSheet,
  useColorScheme,
} from "react-native";

import { useAuth } from "@/context/AuthContext";

const ICON_SIZE = 200;
const MIN_VISIBLE_TIME = 2000;
const FADE_DURATION = 300;

export function SplashLoading() {
  const { loading } = useAuth();
  const colorScheme = useColorScheme();
  const opacity = useMemo(() => new Animated.Value(1), []);
  const [hidden, setHidden] = useState(false);
  const mountedAtRef = useRef(0);

  useEffect(() => {
    mountedAtRef.current = Date.now();
    SplashScreen.hideAsync();
  }, []);

  useEffect(() => {
    if (loading) return;

    const remaining = MIN_VISIBLE_TIME - (Date.now() - mountedAtRef.current);
    const timer = setTimeout(() => {
      Animated.timing(opacity, {
        toValue: 0,
        duration: FADE_DURATION,
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (finished) setHidden(true);
      });
    }, Math.max(0, remaining));

    return () => clearTimeout(timer);
  }, [loading, opacity]);

  if (hidden) return null;

  const isDark = colorScheme === "dark";

  return (
    <Animated.View style={[styles.overlay, { opacity }]}>
      <LinearGradient
        colors={
          isDark
            ? ["#000000", "#0A0A0A"]
            : ["#FFFFFF", "#F1F5F9"]
        }
        style={StyleSheet.absoluteFill}
      />
      <Image
        source={require("@/assets/images/splash-icon.png")}
        style={styles.icon}
        resizeMode="contain"
      />
      <ActivityIndicator
        size="large"
        color={isDark ? "#EAF3DE" : "#3B6D11"}
        style={styles.spinner}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFill,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 100,
  },
  icon: {
    width: ICON_SIZE,
    height: ICON_SIZE,
  },
  spinner: {
    marginTop: 32,
  },
});
