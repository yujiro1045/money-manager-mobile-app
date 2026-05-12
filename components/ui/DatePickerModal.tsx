import Ionicons from "@expo/vector-icons/Ionicons";
import dayjs, { Dayjs } from "dayjs";
import "dayjs/locale/es";
import React, { useState } from "react";
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
} from "react-native";

dayjs.locale("es");

interface DatePickerModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectDate: (date: Dayjs) => void;
  selectedDate?: Dayjs;
}

const DatePickerModal: React.FC<DatePickerModalProps> = ({
  visible,
  onClose,
  onSelectDate,
  selectedDate,
}) => {
  const [currentMonth, setCurrentMonth] = useState(dayjs());

  const getDaysInMonth = (date: Dayjs) => {
    const start = date.startOf("month").startOf("week");
    const end = date.endOf("month").endOf("week");
    const days: Dayjs[] = [];

    let current = start;
    while (current.isBefore(end) || current.isSame(end, "day")) {
      days.push(current);
      current = current.add(1, "day");
    }
    return days;
  };

  const days = getDaysInMonth(currentMonth);
  const isCurrentMonth = currentMonth.isSame(dayjs(), "month");
  const today = dayjs();

  const handlePrevMonth = () => {
    setCurrentMonth(currentMonth.subtract(1, "month"));
  };

  const handleNextMonth = () => {
    if (!isCurrentMonth) {
      setCurrentMonth(currentMonth.add(1, "month"));
    }
  };

  const handleDaySelect = (day: Dayjs) => {
    if (day.isAfter(today, "day")) return;
    onSelectDate(day);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.backdrop} onPress={onClose} />
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Selecciona una fecha</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#374151" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.monthContainer}>
              <View style={styles.monthHeader}>
                <TouchableOpacity
                  onPress={handlePrevMonth}
                  style={styles.monthNav}
                >
                  <Ionicons name="chevron-back" size={24} color="#3B82F6" />
                </TouchableOpacity>

                <Text style={styles.monthLabel}>
                  {currentMonth.format("MMMM YYYY")}
                </Text>

                <TouchableOpacity
                  onPress={handleNextMonth}
                  disabled={isCurrentMonth}
                  style={[styles.monthNav, !isCurrentMonth && { opacity: 0.5 }]}
                >
                  <Ionicons
                    name="chevron-forward"
                    size={24}
                    color={isCurrentMonth ? "#D1D5DB" : "#3B82F6"}
                  />
                </TouchableOpacity>
              </View>

              <View style={styles.weekDays}>
                {["L", "M", "X", "J", "V", "S", "D"].map((day) => (
                  <Text key={day} style={styles.weekDay}>
                    {day}
                  </Text>
                ))}
              </View>

              <View style={styles.daysGrid}>
                {days.map((day, index) => {
                  const isCurrentDay = day.isSame(today, "day");
                  const isSelected = selectedDate?.isSame(day, "day");
                  const isOtherMonth = !day.isSame(currentMonth, "month");
                  const isFuture = day.isAfter(today, "day");

                  return (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.dayButton,
                        isCurrentDay && styles.dayButtonToday,
                        isSelected && styles.dayButtonSelected,
                        (isOtherMonth || isFuture) && styles.dayButtonDisabled,
                      ]}
                      onPress={() => handleDaySelect(day)}
                      disabled={isFuture}
                    >
                      <Text
                        style={[
                          styles.dayText,
                          isCurrentDay && styles.dayTextToday,
                          isSelected && styles.dayTextSelected,
                          (isOtherMonth || isFuture) && styles.dayTextDisabled,
                        ]}
                      >
                        {day.format("D")}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            <View style={styles.todayButton}>
              <TouchableOpacity
                style={styles.todayButtonContent}
                onPress={() => {
                  handleDaySelect(today);
                  setCurrentMonth(today);
                }}
              >
                <Ionicons name="today" size={20} color="#FFFFFF" />
                <Text style={styles.todayButtonText}>Hoy</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default DatePickerModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  backdrop: {
    flex: 1,
  },
  container: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 16,
    paddingHorizontal: 16,
    paddingBottom: 32,
    maxHeight: "90%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },
  closeButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: "#F3F4F6",
  },
  monthContainer: {
    marginBottom: 20,
  },
  monthHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  monthNav: {
    padding: 8,
  },
  monthLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    textTransform: "capitalize",
  },
  weekDays: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 8,
  },
  weekDay: {
    fontSize: 13,
    fontWeight: "600",
    color: "#6B7280",
    width: "14.2%",
    textAlign: "center",
  },
  daysGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 4,
  },
  dayButton: {
    width: "14.2%",
    aspectRatio: 1,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F3F4F6",
  },
  dayButtonToday: {
    backgroundColor: "#E5F7FF",
    borderWidth: 2,
    borderColor: "#3B82F6",
  },
  dayButtonSelected: {
    backgroundColor: "#3B82F6",
  },
  dayButtonDisabled: {
    backgroundColor: "#F9FAFB",
  },
  dayText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#374151",
  },
  dayTextToday: {
    color: "#3B82F6",
    fontWeight: "700",
  },
  dayTextSelected: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  dayTextDisabled: {
    color: "#D1D5DB",
  },
  todayButton: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  todayButtonContent: {
    backgroundColor: "#3B82F6",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  todayButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
});
