import CustomSelect from "@/components/ui/CustomSelect";
import { BACKGROUND, MUTED, PRIMARY, TEXT } from "@/constants/theme2";
import { DashboardPeriod, useDashboard } from "@/hooks/useDasboard";
import dayjs from "dayjs";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { BarChart, PieChart } from "react-native-gifted-charts";
import { SafeAreaView } from "react-native-safe-area-context";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CHART_WIDTH = SCREEN_WIDTH - 64 - 40;

const PILLS: { label: string; value: DashboardPeriod }[] = [
  { label: "Semana", value: "week" },
  { label: "Mes", value: "month" },
  { label: "Año", value: "year" },
];

const formatCurrency = (value: number) =>
  value.toLocaleString("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  });

export default function DashboardScreen() {
  const {
    period,
    setPeriod,
    last6,
    current,
    categoryDistribution,
    healthScore,
    remainingBudget,
    balanceLine,
    expenseLine,
    selectedCategory,
    allCategories,
    setSelectedCategory,
    selectedYear,
    setSelectedYear,
    selectedMonth,
    setSelectedMonth,
  } = useDashboard();

  const [selectedTrendMonth, setSelectedTrendMonth] = React.useState<number>(
    last6.length - 1,
  );
  const currentTrendData = balanceLine[selectedTrendMonth];
  const currentExpenseData = expenseLine[selectedTrendMonth];

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.screenTitle}>Dashboard</Text>
        <View style={styles.pillsRow}>
          {PILLS.map((pill) => (
            <TouchableOpacity
              key={pill.value}
              style={[styles.pill, period === pill.value && styles.pillActive]}
              onPress={() => setPeriod(pill.value)}
            >
              <Text
                style={[
                  styles.pillText,
                  period === pill.value && styles.pillTextActive,
                ]}
              >
                {pill.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.summaryRow}>
          <View style={[styles.summaryCard, { borderLeftColor: "#4AE588" }]}>
            <Text style={styles.summaryLabel}>Ingresos</Text>
            <Text style={[styles.summaryValue, { color: "#4AE588" }]}>
              {formatCurrency(current.income)}
            </Text>
          </View>
          <View style={[styles.summaryCard, { borderLeftColor: "#FF6B76" }]}>
            <Text style={styles.summaryLabel}>Gastos</Text>
            <Text style={[styles.summaryValue, { color: "#FF6B76" }]}>
              {formatCurrency(current.expense)}
            </Text>
          </View>
        </View>
        <LinearGradient
          colors={["#1E1F8E", "#3B3DBF", "#6B6FE0"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.healthCard}
        >
          <View style={styles.healthHeader}>
            <View>
              <Text style={styles.healthTitle}>Salud financiera</Text>
              <Text style={styles.healthStatus}>{healthScore.status}</Text>
            </View>
            <Text style={styles.healthScore}>{healthScore.score}</Text>
          </View>
          <View style={styles.progressBg}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${healthScore.score}%`,
                  backgroundColor: healthScore.color,
                },
              ]}
            />
          </View>
          <View style={styles.healthFooter}>
            <Text style={styles.healthHint}>
              {current.income === 0
                ? "Registra ingresos para ver tu salud financiera"
                : remainingBudget >= 0
                  ? `Puedes gastar ${formatCurrency(remainingBudget)} más este periodo`
                  : `Excediste tu presupuesto por ${formatCurrency(Math.abs(remainingBudget))}`}
            </Text>
          </View>
        </LinearGradient>
        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>Tendencia de ingresos y gastos</Text>
          <View style={styles.trendMonthSelector}>
            {last6.map((period, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.trendMonthButton,
                  selectedTrendMonth === index && styles.trendMonthButtonActive,
                ]}
                onPress={() => setSelectedTrendMonth(index)}
              >
                <Text
                  style={[
                    styles.trendMonthButtonText,
                    selectedTrendMonth === index &&
                      styles.trendMonthButtonTextActive,
                  ]}
                >
                  {period.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          {currentTrendData && currentExpenseData ? (
            (currentTrendData.value ?? 0) > 0 ||
            (currentExpenseData.value ?? 0) > 0 ? (
              <>
                <View style={styles.trendChartContainer}>
                  <BarChart
                    data={[
                      {
                        value: currentTrendData.value ?? 0,
                        label: "Ingresos",
                        frontColor: "#4AE588",
                      },
                      {
                        value: currentExpenseData.value ?? 0,
                        label: "Gastos",
                        frontColor: "#FF6B76",
                      },
                    ]}
                    width={CHART_WIDTH}
                    height={200}
                    barWidth={40}
                    spacing={50}
                    noOfSections={4}
                    yAxisTextStyle={{ color: MUTED, fontSize: 12 }}
                    xAxisLabelTextStyle={{
                      color: MUTED,
                      fontSize: 12,
                      fontWeight: "bold",
                    }}
                    hideRules
                    yAxisColor="transparent"
                    xAxisColor="#E5E7EB"
                    isAnimated
                    barBorderRadius={8}
                  />
                </View>
                <View style={styles.trendIndicatorContainer}>
                  <View style={styles.trendIndicatorItem}>
                    <View
                      style={[
                        styles.trendIndicatorDot,
                        { backgroundColor: "#4AE588" },
                      ]}
                    />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.trendIndicatorLabel}>Ingresos</Text>
                      <Text style={styles.trendIndicatorValue}>
                        {formatCurrency(currentTrendData.value ?? 0)}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.trendIndicatorItem}>
                    <View
                      style={[
                        styles.trendIndicatorDot,
                        { backgroundColor: "#FF6B76" },
                      ]}
                    />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.trendIndicatorLabel}>Gastos</Text>
                      <Text style={styles.trendIndicatorValue}>
                        {formatCurrency(currentExpenseData.value ?? 0)}
                      </Text>
                    </View>
                  </View>
                </View>
                <View
                  style={[
                    styles.trendStatusBadge,
                    {
                      backgroundColor:
                        (currentTrendData.value ?? 0) >
                        (currentExpenseData.value ?? 0)
                          ? "#D1F5E8"
                          : "#FFE5E8",
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.trendStatusText,
                      {
                        color:
                          (currentTrendData.value ?? 0) >
                          (currentExpenseData.value ?? 0)
                            ? "#1DB954"
                            : "#FF6B76",
                      },
                    ]}
                  >
                    {(currentTrendData.value ?? 0) >
                    (currentExpenseData.value ?? 0)
                      ? "Tendencia Positiva"
                      : "Tendencia Negativa"}
                  </Text>
                </View>
              </>
            ) : (
              <Text style={styles.emptyText}>
                Sin movimientos en este período
              </Text>
            )
          ) : null}
        </View>
        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>Distribución de gastos</Text>
          <View style={styles.filtersRow}>
            <CustomSelect
              size="small"
              value={dayjs().month(selectedMonth).format("MMMM")}
              placeholder="Seleccionar mes"
            >
              {Array.from({ length: 12 }, (_, i) => (
                <TouchableOpacity
                  key={i}
                  onPress={() => setSelectedMonth(i)}
                  style={styles.selectOption}
                >
                  <Text style={styles.selectOptionText}>
                    {dayjs().month(i).format("MMMM")}
                  </Text>
                </TouchableOpacity>
              ))}
            </CustomSelect>
            <CustomSelect
              size="small"
              value={selectedYear.toString()}
              placeholder="Seleccionar año"
            >
              {Array.from({ length: dayjs().year() - 2024 + 1 }, (_, i) => {
                const year = dayjs().year() - i;
                return (
                  <TouchableOpacity
                    key={year}
                    onPress={() => setSelectedYear(year)}
                    style={styles.selectOption}
                  >
                    <Text style={styles.selectOptionText}>{year}</Text>
                  </TouchableOpacity>
                );
              })}
            </CustomSelect>
          </View>
          {categoryDistribution.length > 0 ? (
            <View style={styles.pieContainer}>
              <PieChart
                data={categoryDistribution}
                donut
                radius={80}
                innerRadius={50}
                innerCircleColor="#FFFFFF"
                centerLabelComponent={() => (
                  <View style={styles.pieCenter}>
                    <Text style={styles.pieCenterLabel}>
                      {selectedCategory ?? "Gastos"}
                    </Text>
                    <Text style={styles.pieCenterValue}>
                      {formatCurrency(
                        selectedCategory
                          ? (allCategories.find(
                              (c) => c.label === selectedCategory,
                            )?.value ?? 0)
                          : current.expense,
                      )}
                    </Text>
                  </View>
                )}
              />
              <View style={styles.pieLegend}>
                {allCategories.map((cat, i) => {
                  const isSelected = selectedCategory === cat.label;
                  const isFiltered = selectedCategory && !isSelected;
                  return (
                    <TouchableOpacity
                      key={i}
                      style={[
                        styles.pieLegendItem,
                        isSelected && styles.pieLegendItemSelected,
                      ]}
                      onPress={() =>
                        setSelectedCategory(isSelected ? null : cat.label)
                      }
                    >
                      <View
                        style={[
                          {
                            backgroundColor: cat.color,
                            opacity: isFiltered ? 0.3 : 1,
                          },
                        ]}
                      />
                      <Text
                        style={[
                          styles.pieLegendLabel,
                          { opacity: isFiltered ? 0.3 : 1 },
                        ]}
                        numberOfLines={1}
                      >
                        {cat.label}
                      </Text>
                      <Text
                        style={[
                          styles.pieLegendPct,
                          { opacity: isFiltered ? 0.3 : 1 },
                        ]}
                      >
                        {cat.text}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          ) : (
            <Text
              style={[
                styles.emptyText,
                { textAlign: "center", paddingVertical: 40 },
              ]}
            >
              No hubo gastos en {dayjs().month(selectedMonth).format("MMMM")} de{" "}
              {selectedYear}
            </Text>
          )}
          {selectedCategory && (
            <TouchableOpacity
              style={styles.clearButton}
              onPress={() => setSelectedCategory(null)}
            >
              <Text style={styles.clearButtonText}>Ver todas</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: BACKGROUND },
  container: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 100,
    gap: 14,
  },
  screenTitle: { fontSize: 24, fontWeight: "700", color: TEXT },
  pillsRow: { flexDirection: "row", gap: 8 },
  pill: {
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: "#D1D5DB",
    backgroundColor: "#FFFFFF",
  },
  pillActive: { backgroundColor: PRIMARY, borderColor: PRIMARY },
  pillText: { fontSize: 13, fontWeight: "600", color: MUTED },
  pillTextActive: { color: "#FFFFFF" },
  summaryRow: { flexDirection: "row", gap: 12 },
  summaryCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    borderLeftWidth: 4,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  summaryLabel: { fontSize: 12, color: MUTED, marginBottom: 4 },
  summaryValue: { fontSize: 16, fontWeight: "700" },
  healthCard: {
    borderRadius: 20,
    padding: 20,
    gap: 12,
    shadowColor: "#1E1F8E",
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  healthHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  healthTitle: {
    fontSize: 13,
    color: "rgba(255,255,255,0.7)",
    fontWeight: "500",
  },
  healthStatus: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
    marginTop: 2,
  },
  healthScore: {
    fontSize: 42,
    fontWeight: "800",
    color: "#FFFFFF",
    opacity: 0.9,
  },
  progressBg: {
    height: 8,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: { height: 8, borderRadius: 4 },
  healthFooter: {},
  healthHint: {
    fontSize: 12,
    color: "rgba(255,255,255,0.75)",
    fontWeight: "500",
  },
  chartCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    gap: 12,
  },
  chartTitle: { fontSize: 16, fontWeight: "700", color: TEXT },
  emptyText: {
    textAlign: "center",
    color: MUTED,
    fontSize: 13,
    paddingVertical: 20,
  },
  pieContainer: { flexDirection: "row", alignItems: "center", gap: 16 },
  pieCenter: { alignItems: "center", width: 90, paddingHorizontal: 2 },
  pieCenterLabel: { fontSize: 11, color: MUTED },
  pieCenterValue: { fontSize: 12, fontWeight: "700", color: TEXT },
  pieLegend: { flex: 1, gap: 6 },
  pieLegendItem: { flexDirection: "row", alignItems: "center", gap: 6 },
  pieLegendLabel: { flex: 1, fontSize: 11, color: TEXT },
  pieLegendPct: { fontSize: 11, fontWeight: "700", color: MUTED },
  pieLegendItemSelected: {
    backgroundColor: "#F0F0FF",
    borderRadius: 8,
    paddingHorizontal: 4,
  },
  clearButton: {
    alignSelf: "center",
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: "#F0F0FF",
    marginTop: 4,
  },
  clearButtonText: { fontSize: 12, color: PRIMARY, fontWeight: "600" },
  filtersRow: {
    flexDirection: "row",
    gap: 12,
    justifyContent: "space-between",
    marginBottom: 4,
  },
  selectOption: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 0.5,
    borderBottomColor: "#E5E7EB",
    flexDirection: "row",
    alignItems: "center",
  },
  selectOptionText: { fontSize: 15, color: TEXT, fontWeight: "500" },
  trendMonthSelector: {
    flexDirection: "row",
    gap: 8,
    justifyContent: "space-between",
    marginBottom: 12,
  },
  trendMonthButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#E5E7EB",
    backgroundColor: "#FFFFFF",
    alignItems: "center",
  },
  trendMonthButtonActive: { backgroundColor: PRIMARY, borderColor: PRIMARY },
  trendMonthButtonText: { fontSize: 12, fontWeight: "600", color: MUTED },
  trendMonthButtonTextActive: { color: "#FFFFFF" },
  trendChartContainer: { marginVertical: 12, alignItems: "center" },
  trendIndicatorContainer: {
    flexDirection: "row",
    gap: 12,
    marginTop: 12,
    marginBottom: 12,
  },
  trendIndicatorItem: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#F9FAFB",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
  },
  trendIndicatorDot: { width: 12, height: 12, borderRadius: 6 },
  trendIndicatorLabel: { fontSize: 10, color: MUTED, fontWeight: "500" },
  trendIndicatorValue: {
    fontSize: 12,
    fontWeight: "700",
    color: TEXT,
    marginTop: 2,
  },
  trendStatusBadge: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
  },
  trendStatusText: { fontSize: 13, fontWeight: "700" },
});
