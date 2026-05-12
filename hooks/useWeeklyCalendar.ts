import dayjs from "dayjs";
import "dayjs/locale/es";
import { useState } from "react";

dayjs.locale("es");

type Transaction = {
  type: "income" | "expense";
  amount: number;
  createdAt: any;
};

export const useWeeklyCalendar = (transactions: Transaction[]) => {
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [weekOffset, setWeekOffset] = useState(0);

  const handleDayPress = (dateString: string) => {
    setSelectedDay((prev) => (prev === dateString ? null : dateString));
  };

  const handlePrevWeek = () => {
    setWeekOffset((o) => o - 1);
    setSelectedDay(null);
  };

  const handleNextWeek = () => {
    setWeekOffset((o) => o + 1);
    setSelectedDay(null);
  };

  const getDayData = () => {
    if (!selectedDay) return null;

    return transactions.reduce(
      (acc, tx) => {
        if (!tx.createdAt) return acc;

        const txDay = dayjs(tx.createdAt).format("YYYY-MM-DD");

        if (txDay !== selectedDay) return acc;

        if (tx.type === "income") {
          acc.income += tx.amount;
          acc.balance += tx.amount;
        } else {
          acc.expense += tx.amount;
          acc.balance -= tx.amount;
        }

        return acc;
      },
      {
        income: 0,
        expense: 0,
        balance: 0,
      },
    );
  };

  const dayData = getDayData();
  const dayLabel = selectedDay
    ? dayjs(selectedDay).format("D [de] MMMM YYYY")
    : null;

  return {
    selectedDay,
    weekOffset,
    dayData,
    dayLabel,
    handleDayPress,
    handlePrevWeek,
    handleNextWeek,
  };
};
