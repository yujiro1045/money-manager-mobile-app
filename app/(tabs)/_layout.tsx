import CustomNavBar from "@/components/ui/CustomNavBar";
import {
  DashboardIcon,
  HomeIcon,
  ProfileIcon,
  TransactionIcon,
} from "@/components/ui/icons/tabs-icons";
import { BACKGROUND } from "@/constants/theme2";
import { Redirect, Tabs } from "expo-router";
import React from "react";
import { useAuth } from "../../context/AuthContext";

export default function TabLayout() {
  //const colorScheme = useColorScheme();

  const { user, loading } = useAuth();

  if (loading) return null;

  if (!user) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <Tabs
      tabBar={(props) => <CustomNavBar {...props} />}
      screenOptions={{
        //tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,

        sceneStyle: {
          backgroundColor: BACKGROUND,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Inicio",
          tabBarIcon: ({ color }) => <HomeIcon color={color} />,
        }}
      />
      <Tabs.Screen
        name="transactions"
        options={{
          title: "Transacciones",
          tabBarIcon: ({ color }) => <TransactionIcon color={color} />,
        }}
      />
      <Tabs.Screen
        name="dashboard"
        options={{
          title: "Dashboard",
          tabBarIcon: ({ color }) => <DashboardIcon color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Perfil",
          tabBarIcon: ({ color }) => <ProfileIcon color={color} />,
        }}
      />
    </Tabs>
  );
}
