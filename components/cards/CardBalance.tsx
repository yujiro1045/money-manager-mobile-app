import WeeklyCalendar from "@/components/cards/WeeklyCalendar";
import { Period, useBalanceByPeriod } from "@/hooks/useBalanceByPeriod";
import { useWeeklyCalendar } from "@/hooks/useWeeklyCalendar";
import Ionicons from "@expo/vector-icons/Ionicons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const SELECTERS = [
  { label: "Semana", value: "week" as Period },
  { label: "Mes", value: "month" as Period },
  { label: "Año", value: "year" as Period },
];

const CardBalance = () => {
  const {
    period,
    income,
    expense,
    balance,
    periodLabel,
    statLabel,
    handlePeriod,
    goBack,
    goForward,
    isCurrentPeriod,
    transactions,
  } = useBalanceByPeriod();

  const {
    selectedDay,
    weekOffset,
    dayData,
    dayLabel,
    handleDayPress,
    handlePrevWeek,
    handleNextWeek,
  } = useWeeklyCalendar(transactions);

  const formatCurrency = (value: number) =>
    value.toLocaleString("es-CO", {
      style: "currency",
      currency: "COP",
      maximumFractionDigits: 0,
    });

  const isWeekPeriod = period === "week";

  const displayBalance = dayData ? dayData.balance : balance;
  const displayIncome = dayData ? dayData.income : income;
  const displayExpense = dayData ? dayData.expense : expense;
  const displayLabel = dayLabel ?? periodLabel;

  return (
    <LinearGradient
      colors={["#1E1F8E", "#3B3DBF", "#6B6FE0"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.card}
    >
      {/* Selectores */}
      <View style={styles.selectersRow}>
        {SELECTERS.map((selecter) => (
          <TouchableOpacity
            key={selecter.value}
            style={[
              styles.selecter,
              period === selecter.value &&
                !selectedDay &&
                styles.selecterActive,
            ]}
            onPress={() => {
              handlePeriod(selecter.value);
            }}
          >
            <Text
              style={[
                styles.selecterText,
                period === selecter.value &&
                  !selectedDay &&
                  styles.selecterTextActive,
              ]}
            >
              {selecter.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Calendario semanal o navegación normal */}
      {isWeekPeriod ? (
        <WeeklyCalendar
          selectedDay={selectedDay}
          weekOffset={weekOffset}
          onDayPress={handleDayPress}
          onPrevWeek={handlePrevWeek}
          onNextWeek={handleNextWeek}
        />
      ) : (
        <View style={styles.navRow}>
          <TouchableOpacity style={styles.navButton} onPress={goBack}>
            <Ionicons
              name="chevron-back"
              size={20}
              color="rgba(255,255,255,0.8)"
            />
          </TouchableOpacity>
          <Text style={styles.label}>{displayLabel}</Text>
          <TouchableOpacity
            style={styles.navButton}
            onPress={goForward}
            disabled={isCurrentPeriod}
          >
            <Ionicons
              name="chevron-forward"
              size={20}
              color={
                isCurrentPeriod
                  ? "rgba(255,255,255,0.25)"
                  : "rgba(255,255,255,0.8)"
              }
            />
          </TouchableOpacity>
        </View>
      )}

      {/* Label día seleccionado */}
      {selectedDay && isWeekPeriod && (
        <Text style={styles.label}>{displayLabel}</Text>
      )}

      <Text style={styles.balance}>{formatCurrency(displayBalance)}</Text>
      <View style={styles.divider} />

      <View style={styles.row}>
        <View style={styles.stat}>
          <View
            style={[styles.dot, { backgroundColor: "rgba(46,213,115,0.2)" }]}
          >
            <Ionicons name="arrow-up-circle" size={22} color="#4AE588" />
          </View>
          <View style={styles.statInfo}>
            <Text style={styles.statLabel} numberOfLines={2}>
              {selectedDay ? "Ingresos del día" : `Ingresos ${statLabel}`}
            </Text>
            <Text style={[styles.statAmount, { color: "#4AE588" }]}>
              {formatCurrency(displayIncome)}
            </Text>
          </View>
        </View>

        <View style={styles.stat}>
          <View
            style={[styles.dot, { backgroundColor: "rgba(255,107,118,0.2)" }]}
          >
            <Ionicons name="arrow-down-circle" size={22} color="#FF6B76" />
          </View>
          <View style={styles.statInfo}>
            <Text style={styles.statLabel} numberOfLines={2}>
              {selectedDay ? "Gastos del día" : `Gastos ${statLabel}`}
            </Text>
            <Text style={[styles.statAmount, { color: "#FF6B76" }]}>
              {formatCurrency(displayExpense)}
            </Text>
          </View>
        </View>
      </View>
    </LinearGradient>
  );
};

export default CardBalance;

const styles = StyleSheet.create({
  card: {
    padding: 20,
    borderRadius: 20,
    marginBottom: 10,
    shadowColor: "#1E1F8E",
    shadowOpacity: 0.45,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 10,
  },
  selectersRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 6,
    marginBottom: 12,
  },
  selecter: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.3)",
  },
  selecterActive: {
    backgroundColor: "rgba(255,255,255,0.2)",
    borderColor: "rgba(255,255,255,0.7)",
  },
  selecterText: {
    fontSize: 11,
    fontWeight: "600",
    color: "rgba(255,255,255,0.5)",
  },
  selecterTextActive: {
    color: "#FFFFFF",
  },
  navRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  navButton: {
    padding: 2,
  },
  label: {
    fontSize: 13,
    color: "rgba(255,255,255,0.75)",
    fontWeight: "500",
    marginBottom: 8,
  },
  balance: {
    fontSize: 32,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 20,
    marginTop: 4,
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.15)",
    marginBottom: 20,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  stat: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flex: 1,
  },
  statInfo: { flex: 1 },
  dot: {
    width: 40,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  statLabel: {
    fontSize: 12,
    color: "rgba(255,255,255,0.7)",
    padding: 3,
  },
  statAmount: {
    fontSize: 14,
    fontWeight: "700",
  },
});
