import React, { useState, useMemo, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Alert,
  ActivityIndicator
} from "react-native";
import {
  ChevronLeft,
  ChevronRight,
  PlusCircle,
  TrendingUp,
  CreditCard,
  Calendar,
  Filter,
  ArrowUpRight,
  PieChart,
  Tag,
  Circle,
  ArrowRight
} from "lucide-react-native";
import dayjs from "dayjs";
import { useRouter } from "expo-router";
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import customParseFormat from "dayjs/plugin/customParseFormat";
import axios from "axios";
dayjs.extend(customParseFormat);
import Constants from 'expo-constants';
import HeaderCustom from "../components/header";
import { ButtonMain } from "../components/button";

const { width } = Dimensions.get("window");

// ประเภทค่าใช้จ่าย
const EXPENSE_TYPES = {
  "ค่าอาหาร": { icon: "🍲", color: "#FF9500" },
  "ค่ายา": { icon: "💊", color: "#34C759" },
  "ค่าท่องเที่ยว": { icon: "🏖️", color: "#5856D6" },
  "ค่าน้ำค่าไฟ": { icon: "💡", color: "#007AFF" },
  "อื่นๆ": { icon: "📋", color: "#8E8E93" },
};

interface Expense {
  id: string;
  date: string; // format: YYYY-MM-DD
  amount: number;
  typeTranfer: string;
  detail: string;
  sender: string;
  recipient?: string;
}

export default function ExpenseReportScreen() {
  const [expenses, setExpenses] = useState<Expense[] | null>(null);
  const [currentMonth, setCurrentMonth] = useState(dayjs());
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [dailySummary, setDailySummary] = useState<Record<string, number>>({});
  const [totalMonthAmount, setTotalMonthAmount] = useState<number>(0);

  const API_BACKEND = Constants.expoConfig?.extra?.API_BACKEND;
  const router = useRouter();

  const handlePrevMonth = () => setCurrentMonth((prev) => prev.subtract(1, "month"));
  const handleNextMonth = () => setCurrentMonth((prev) => prev.add(1, "month"));

  useFocusEffect(
    useCallback(() => {
      const loadExpenses = async () => {
        setIsLoading(true);
        try {
          const response = await axios.get(API_BACKEND + `/tranfersByMonth?month=${currentMonth.format("MM")}&year=${currentMonth.format("YYYY")}`);
          const data = response.data;

          const formattedExpenses: Expense[] = (data.expenses ?? []).map((item: any) => ({
            id: item.id,
            date: item.date || dayjs(item.created_at).format("YYYY-MM-DD"),
            amount: item.amount,
            typeTranfer: item.typeTranfer || "อื่นๆ",
            detail: item.detail || "",
            sender: item.sender || "เงินสด",
            recipient: item.recipient || "",
          }));

          setExpenses(formattedExpenses);
          setDailySummary(data.dailySummary || {});
          setTotalMonthAmount(data.totalMonthAmount || 0);
        } catch (error) {
          console.error("โหลดข้อมูลไม่สำเร็จ:", error);
          Alert.alert("เกิดข้อผิดพลาด", "ไม่สามารถโหลดข้อมูลรายจ่ายได้");
        } finally {
          setIsLoading(false);
        }
      };

      loadExpenses();
    }, [currentMonth])
  );

  const filteredExpenses = useMemo(() => {
    if (!expenses) return [];
    let filtered = expenses.filter((e) =>
      dayjs(e.date).isSame(currentMonth, "month")
    );
    if (selectedType) {
      filtered = filtered.filter((e) => e.typeTranfer === selectedType);
    }
    return filtered;
  }, [currentMonth, expenses, selectedType]);

  const expenseTypes = useMemo(() => {
    if (!expenses) return [];
    const types = new Set<string>();
    expenses.forEach(expense => {
      if (expense.typeTranfer) types.add(expense.typeTranfer);
    });
    return Array.from(types);
  }, [expenses]);

  const typeBreakdown = useMemo(() => {
    if (!filteredExpenses.length) return {};
    const breakdown: Record<string, number> = {};
    filteredExpenses.forEach(expense => {
      const type = expense.typeTranfer || "อื่นๆ";
      if (!breakdown[type]) breakdown[type] = 0;
      breakdown[type] += expense.amount;
    });
    return breakdown;
  }, [filteredExpenses]);

  const maxExpenseDay = useMemo(() => {
    let maxDate = "";
    let maxAmount = 0;
    Object.entries(dailySummary).forEach(([date, amount]) => {
      if (amount > maxAmount) {
        maxDate = date;
        maxAmount = amount;
      }
    });
    return maxDate ? { date: maxDate, amount: maxAmount } : null;
  }, [dailySummary]);

  const daysInMonth = useMemo(() => {
    const days = [];
    const startOfMonth = currentMonth.startOf("month");
    const endOfMonth = currentMonth.endOf("month");

    for (
      let date = startOfMonth;
      date.isBefore(endOfMonth) || date.isSame(endOfMonth);
      date = date.add(1, "day")
    ) {
      const dateStr = date.format("YYYY-MM-DD");
      const totalAmount = dailySummary[dateStr] || 0;

      days.push({
        date: dateStr,
        display: date.format("D MMM"),
        amount: totalAmount,
        isToday: date.isSame(dayjs(), "day"),
      });
    }

    return days;
  }, [currentMonth, dailySummary]);

  const handleDayPress = (day: (typeof daysInMonth)[0]) => {
    console.log("day", day);
    if (day.amount === 0) return;
    router.push({
      pathname: "/detail",
      params: { date: day.date, displayDate: day.display }
    });
  };

  const getColorForType = (type: string) =>
    EXPENSE_TYPES[type as keyof typeof EXPENSE_TYPES]?.color || "#8E8E93";

  const getIconForType = (type: string) =>
    EXPENSE_TYPES[type as keyof typeof EXPENSE_TYPES]?.icon || "📋";

  return (
    <View className="flex-1 bg-gray-50">
      <HeaderCustom title="รายงานการใช้จ่าย" />
      {isLoading ? (
        <View className="flex-1 justify-center items-center pt-16">
          <ActivityIndicator size="large" color="#007AFF" />
          <Text className="font-semibold text-gray-600 mt-3">กำลังโหลดข้อมูล...</Text>
        </View>
      ) : (
        <ScrollView className="flex-1">
          <View className="bg-white rounded-xl shadow-sm mx-4 mt-4 p-4">
            <View className="flex-row justify-between items-center">
              <TouchableOpacity className="p-2 rounded-full bg-gray-100" onPress={handlePrevMonth}>
                <ChevronLeft size={24} color="#4a86e8" />
              </TouchableOpacity>
              <View className="flex-row items-center">
                <Calendar size={18} color="#4a86e8" className="mr-2" />
                <Text className="text-lg font-semibold text-gray-800">
                  {currentMonth.format("MMMM YYYY")}
                </Text>
              </View>
              <TouchableOpacity className="p-2 rounded-full bg-gray-100" onPress={handleNextMonth}>
                <ChevronRight size={24} color="#4a86e8" />
              </TouchableOpacity>
            </View>
          </View>

          {/* ยอดใช้จ่ายเดือนนี้ */}
          <View className="bg-white rounded-xl shadow-sm mx-4 mt-4 p-5">
            <Text className="text-base text-gray-500 mb-1">ยอดใช้จ่ายเดือนนี้</Text>
            <View className="flex-row items-center">
              <Text className="text-3xl font-bold text-gray-800">฿</Text>
              <Text className="text-3xl font-bold text-gray-800 ml-1">
                {totalMonthAmount.toLocaleString()}
              </Text>
              {selectedType && (
                <View className="ml-3 bg-blue-100 px-3 py-1 rounded-full">
                  <Text className="text-blue-600 font-medium text-sm">
                    {selectedType}
                  </Text>
                </View>
              )}
            </View>

            {maxExpenseDay && (
              <View className="flex-row items-center mt-3 bg-gray-50 p-3 rounded-lg">
                <TrendingUp size={16} color="#FF3B30" />
                <Text className="text-gray-600 text-sm ml-2">
                  วันที่ใช้จ่ายสูงสุด: {dayjs(maxExpenseDay.date).format("D MMM")}
                  <Text className="font-semibold text-red-500">
                    {" "}฿{maxExpenseDay.amount.toLocaleString()}
                  </Text>
                </Text>
              </View>
            )}
          </View>

          {/* ประเภทรายจ่าย */}
          <View className="bg-white rounded-xl shadow-sm mx-4 mt-4 p-5">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-base font-semibold text-gray-700">ประเภทรายจ่าย</Text>
              {selectedType && (
                <TouchableOpacity onPress={() => setSelectedType(null)} className="flex-row items-center">
                  <Text className="text-blue-500 text-sm mr-1">ดูทั้งหมด</Text>
                  <Filter size={14} color="#4a86e8" />
                </TouchableOpacity>
              )}
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
              {expenseTypes.map((type) => (
                <TouchableOpacity
                  key={type}
                  onPress={() => setSelectedType(type === selectedType ? null : type)}
                  className={`mr-2 px-4 py-2 rounded-full flex-row items-center ${selectedType === type ? "bg-blue-500" : "bg-gray-100"
                    }`}
                >
                  <Text className="mr-2">{getIconForType(type)}</Text>
                  <Text className={`${selectedType === type ? "text-white" : "text-gray-700"} font-medium`}>
                    {type}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            {Object.keys(typeBreakdown).length > 0 ? (
              <View className="mb-2">
                {Object.entries(typeBreakdown).map(([type, amount]) => (
                  <View key={type} className="flex-row justify-between items-center mb-3">
                    <View className="flex-row items-center">
                      <View style={{ backgroundColor: getColorForType(type) }} className="w-3 h-3 rounded-full mr-3" />
                      <Text className="text-gray-700">{type}</Text>
                    </View>
                    <Text className="font-semibold text-gray-800">฿{amount.toLocaleString()}</Text>
                  </View>
                ))}
              </View>
            ) : (
              <Text className="text-gray-500 text-center py-4">ไม่มีข้อมูลรายจ่ายในเดือนนี้</Text>
            )}
          </View>

          {/* แสดงรายวัน */}
          <View className="bg-white rounded-xl shadow-sm mx-4 mt-4 p-5 mb-6">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-base font-semibold text-gray-700">รายการรายวัน</Text>
              <CreditCard size={18} color="#4a86e8" />
            </View>

            <View className="mb-2">
              {daysInMonth.map((day) => (
                <TouchableOpacity
                  key={day.date}
                  onPress={() => handleDayPress(day)}
                  disabled={day.amount === 0}
                  className={`flex-row justify-between py-3 px-2 border-b border-gray-100 ${day.isToday ? "bg-blue-50 rounded-lg" : ""
                    }`}
                >
                  <View className="flex-row items-center">
                    <Text className={`${day.isToday ? "text-blue-600 font-semibold" : "text-gray-700"}`}>
                      {day.display}
                    </Text>
                    {day.isToday && (
                      <View className="ml-2 px-2 py-1 bg-blue-100 rounded-full">
                        <Text className="text-blue-600 text-xs">วันนี้</Text>
                      </View>
                    )}
                  </View>
                  <View className="flex-row items-center">
                    <Text className={`${day.amount > 0 ? "text-red-500 font-semibold" : "text-gray-400"}`}>
                      {day.amount > 0 ? `฿${day.amount.toLocaleString()}` : "-"}
                    </Text>
                    {day.amount > 0 && (
                      <ArrowRight size={20} color="#4a86e8" className="ml-2" />
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </View>
            <ButtonMain onPress={() => router.push("/getAll")}>
              <>
                <Text className="text-white font-bold">ดูรายการทั้งหมด</Text>
                <ArrowUpRight size={16} color="#ffffff" style={{ marginLeft: 6 }} />
              </>
            </ButtonMain>
          </View>
        </ScrollView>
      )}
    </View>
  );
}
