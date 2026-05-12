import Ionicons from "@expo/vector-icons/Ionicons";
import dayjs from "dayjs";
import "dayjs/locale/es";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

dayjs.locale("es");

type Props = {
  selectedDay: string | null;
  weekOffset: number;
  onDayPress: (dateString: string) => void;
  onPrevWeek: () => void;
  onNextWeek: () => void;
};

export default function WeeklyCalendar({
  selectedDay,
  weekOffset,
  onDayPress,
  onPrevWeek,
  onNextWeek,
}: Props) {
  const today = dayjs().format("YYYY-MM-DD");
  const isCurrentWeek = weekOffset === 0;

  const weekDays = Array.from({ length: 7 }, (_, i) =>
    dayjs().startOf("week").add(weekOffset, "week").add(i, "day"),
  );

  return (
    <View style={styles.container}>
      {/* Navegación de semana */}
      <View style={styles.navRow}>
        <TouchableOpacity onPress={onPrevWeek}>
          <Ionicons
            name="chevron-back"
            size={18}
            color="rgba(255,255,255,0.8)"
          />
        </TouchableOpacity>

        <Text style={styles.rangeLabel}>
          {weekDays[0].format("D MMM")} - {weekDays[6].format("D MMM YYYY")}
        </Text>

        <TouchableOpacity onPress={onNextWeek} disabled={isCurrentWeek}>
          <Ionicons
            name="chevron-forward"
            size={18}
            color={
              isCurrentWeek ? "rgba(255,255,255,0.25)" : "rgba(255,255,255,0.8)"
            }
          />
        </TouchableOpacity>
      </View>

      {/* Días */}
      <View style={styles.daysRow}>
        {weekDays.map((day) => {
          const dateStr = day.format("YYYY-MM-DD");
          const isSelected = selectedDay === dateStr;
          const isToday = dateStr === today;

          return (
            <TouchableOpacity
              key={dateStr}
              style={[
                styles.dayButton,
                isSelected && styles.dayButtonSelected,
                isToday && !isSelected && styles.dayButtonToday,
              ]}
              onPress={() => onDayPress(dateStr)}
            >
              <Text
                style={[styles.dayName, isSelected && styles.dayTextSelected]}
              >
                {day.format("dd")[0]}
              </Text>
              <Text
                style={[
                  styles.dayNumber,
                  isSelected && styles.dayTextSelected,
                  isToday && !isSelected && styles.dayNumberToday,
                ]}
              >
                {day.format("D")}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 8,
    gap: 8,
  },
  navRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  rangeLabel: {
    fontSize: 12,
    color: "rgba(255,255,255,0.75)",
    fontWeight: "500",
  },
  daysRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  dayButton: {
    alignItems: "center",
    justifyContent: "center",
    width: 36,
    height: 48,
    borderRadius: 12,
    gap: 2,
  },
  dayButtonSelected: {
    backgroundColor: "rgba(255,255,255,0.25)",
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.7)",
  },
  dayButtonToday: {
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.4)",
  },
  dayName: {
    fontSize: 10,
    color: "rgba(255,255,255,0.5)",
    fontWeight: "600",
    textTransform: "uppercase",
  },
  dayNumber: {
    fontSize: 14,
    color: "rgba(255,255,255,0.8)",
    fontWeight: "600",
  },
  dayNumberToday: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
  dayTextSelected: {
    color: "#FFFFFF",
  },
});
