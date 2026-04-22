import { BACKGROUND, MUTED, PRIMARY, TEXT } from "@/constants/theme2";
import { DashboardPeriod, useDashboard } from "@/hooks/useDasboard";
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
import { BarChart, LineChart, PieChart } from "react-native-gifted-charts";
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
  } = useDashboard();

  const barData = last6.flatMap((m) => [
    { value: m.income, label: m.label, frontColor: "#4AE588", spacing: 4 },
    { value: m.expense, frontColor: "#FF6B76", spacing: 18 },
  ]);

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
          <Text style={styles.chartTitle}>Ingresos vs Gastos</Text>
          <View style={styles.legend}>
            <View style={styles.legendItem}>
              <View
                style={[styles.legendDot, { backgroundColor: "#4AE588" }]}
              />
              <Text style={styles.legendText}>Ingresos</Text>
            </View>
            <View style={styles.legendItem}>
              <View
                style={[styles.legendDot, { backgroundColor: "#FF6B76" }]}
              />
              <Text style={styles.legendText}>Gastos</Text>
            </View>
          </View>
          {barData.length > 0 ? (
            <BarChart
              data={barData}
              width={CHART_WIDTH}
              height={180}
              barWidth={18}
              noOfSections={4}
              barBorderRadius={6}
              yAxisTextStyle={{ color: MUTED, fontSize: 10 }}
              xAxisLabelTextStyle={{ color: MUTED, fontSize: 10 }}
              hideRules
              hideAxesAndRules={false}
              yAxisColor="transparent"
              xAxisColor="#E5E7EB"
              isAnimated
            />
          ) : (
            <Text style={styles.emptyText}>Sin datos para este periodo</Text>
          )}
        </View>

        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>Tendencia del balance</Text>
          {balanceLine.some((p) => p.value !== 0) ? (
            <LineChart
              data={balanceLine}
              width={CHART_WIDTH}
              height={160}
              color="#6B6FE0"
              thickness={2}
              noOfSections={4}
              curved
              areaChart
              startFillColor="#6B6FE0"
              endFillColor="transparent"
              startOpacity={0.2}
              endOpacity={0}
              yAxisTextStyle={{ color: MUTED, fontSize: 10 }}
              xAxisLabelTextStyle={{ color: MUTED, fontSize: 10 }}
              hideRules
              yAxisColor="transparent"
              xAxisColor="#E5E7EB"
              dataPointsColor="#6B6FE0"
              isAnimated
              backgroundColor="transparent"
            />
          ) : (
            <Text style={styles.emptyText}>Sin datos para este periodo</Text>
          )}
        </View>

        {categoryDistribution.length > 0 && (
          <View style={styles.chartCard}>
            <Text style={styles.chartTitle}>Distribución de gastos</Text>
            <View style={styles.pieContainer}>
              <PieChart
                data={categoryDistribution}
                donut
                radius={80}
                innerRadius={50}
                innerCircleColor="#FFFFFF"
                centerLabelComponent={() => (
                  <View style={styles.pieCenter}>
                    <Text style={styles.pieCenterLabel}>Gastos</Text>
                    <Text style={styles.pieCenterValue}>
                      {formatCurrency(current.expense)}
                    </Text>
                  </View>
                )}
              />
              <View style={styles.pieLegend}>
                {categoryDistribution.map((cat, i) => (
                  <View key={i} style={styles.pieLegendItem}>
                    <View
                      style={[styles.legendDot, { backgroundColor: cat.color }]}
                    />
                    <Text style={styles.pieLegendLabel} numberOfLines={1}>
                      {cat.label}
                    </Text>
                    <Text style={styles.pieLegendPct}>{cat.text}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: BACKGROUND,
  },

  container: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 100,
    gap: 14,
  },

  screenTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: TEXT,
  },

  // Pills
  pillsRow: {
    flexDirection: "row",
    gap: 8,
  },
  pill: {
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: "#D1D5DB",
    backgroundColor: "#FFFFFF",
  },
  pillActive: {
    backgroundColor: PRIMARY,
    borderColor: PRIMARY,
  },
  pillText: {
    fontSize: 13,
    fontWeight: "600",
    color: MUTED,
  },
  pillTextActive: {
    color: "#FFFFFF",
  },

  summaryRow: {
    flexDirection: "row",
    gap: 12,
  },
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
  summaryLabel: {
    fontSize: 12,
    color: MUTED,
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: "700",
  },

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
  progressFill: {
    height: 8,
    borderRadius: 4,
  },
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

  chartTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: TEXT,
  },
  legend: {
    flexDirection: "row",
    gap: 16,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendText: {
    fontSize: 12,
    color: MUTED,
  },
  emptyText: {
    textAlign: "center",
    color: MUTED,
    fontSize: 13,
    paddingVertical: 20,
  },

  pieContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  pieCenter: {
    alignItems: "center",
  },
  pieCenterLabel: {
    fontSize: 11,
    color: MUTED,
  },
  pieCenterValue: {
    fontSize: 12,
    fontWeight: "700",
    color: TEXT,
  },
  pieLegend: {
    flex: 1,
    gap: 6,
  },
  pieLegendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  pieLegendLabel: {
    flex: 1,
    fontSize: 11,
    color: TEXT,
  },
  pieLegendPct: {
    fontSize: 11,
    fontWeight: "700",
    color: MUTED,
  },
});
