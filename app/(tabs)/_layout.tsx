import {
  DashboardIcon,
  HomeIcon,
  TransactionIcon,
} from "@/components/ui/icons/tabs-icons";
import { BACKGROUND } from "@/constants/theme2";
import { Tabs } from "expo-router";
import React from "react";

export default function TabLayout() {
  //const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        //tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#222a35ff",
          borderTopWidth: 0,
          elevation: 0,
          height: 65,
        },
        sceneStyle: {
          backgroundColor: BACKGROUND,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => <HomeIcon color={color} />,
        }}
      />
      <Tabs.Screen
        name="transactions"
        options={{
          title: "Transactions",
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
    </Tabs>
  );
}
