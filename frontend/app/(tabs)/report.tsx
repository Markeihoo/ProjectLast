// import React, { useState, useMemo, useEffect } from "react";
// import {
//     View,
//     Text,
//     StyleSheet,
//     Pressable,
//     ScrollView,
//     TouchableOpacity,
//     Dimensions,
//     Alert,
// } from "react-native";
// import {
//     ChevronLeft,
//     ChevronRight,
//     PlusCircle,
//     TrendingUp,
//     CreditCard,
//     DollarSign,
//     ArrowDownCircle,
//     ArrowUpCircle,
//     PieChart,
//     ArrowLeft,
// } from "lucide-react-native";
// import dayjs from "dayjs";
// import { useRouter } from "expo-router";
// //import { getAllTransactions } from "../../lib/database"; // เปลี่ยน path ตามที่คุณเก็บไฟล์ไว้
// import { useFocusEffect } from '@react-navigation/native';
// import { useCallback } from 'react';
// import customParseFormat from "dayjs/plugin/customParseFormat";
// import axios from "axios";
// dayjs.extend(customParseFormat);
// import Constants from 'expo-constants';
// import { House } from "lucide-react-native";
// import HeaderCustom from "../components/header";
// import { ButtonMain } from "../components/button";


// const { width } = Dimensions.get("window");

// // ประเภทค่าใช้จ่าย
// const CATEGORIES = {
//     food: { name: "อาหาร", color: "#FF9500" },
//     transport: { name: "เดินทาง", color: "#5856D6" },
//     shopping: { name: "ช้อปปิ้ง", color: "#FF2D55" },
//     bills: { name: "บิล/ค่างวด", color: "#007AFF" },
//     entertainment: { name: "บันเทิง", color: "#AF52DE" },
//     health: { name: "สุขภาพ", color: "#34C759" },
//     other: { name: "อื่นๆ", color: "#8E8E93" },
// };

// interface Expense {
//     id: string;
//     date: string; // format: YYYY-MM-DD
//     amount: number;
//     category: keyof typeof CATEGORIES;
//     description: string;
// }


// export default function HomeScreen() {
//     const [expenses, setExpenses] = useState<Expense[] | null>(null);


//     const [currentMonth, setCurrentMonth] = useState(dayjs());
//     const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
//     const API_KEY = Constants.expoConfig?.extra?.API_KEY;
//     const API_BACKEND = Constants.expoConfig?.extra?.API_BACKEND;
//     const handlePrevMonth = () =>
//         setCurrentMonth((prev) => prev.subtract(1, "month"));
//     const handleNextMonth = () => setCurrentMonth((prev) => prev.add(1, "month"));
//     console.log("BACKEND:", API_BACKEND);

//     const router = useRouter();



//     useFocusEffect(
//         useCallback(() => {
//             const loadExpenses = async () => {
//                 try {
//                     const response = await axios.get(API_BACKEND + "/tranfers");
//                     const stored = response.data;


//                     const converted: Expense[] = stored.map((item: any) => ({
//                         id: item.id,
//                         date: dayjs(item.date).isValid()
//                             ? dayjs(item.date).format("YYYY-MM-DD")
//                             : dayjs(item.created_at).format("YYYY-MM-DD"),
//                         amount: item.amount,
//                         category: "other", // fix category เป็นค่าเดียว
//                         description: `${item.sender ?? "(ไม่ระบุ)"} → ${item.recipient ?? "(ไม่ระบุ)"}`,
//                     }));

//                     setExpenses(converted);
//                     console.log("โหลดข้อมูลสําเร็จ:", converted);
//                 } catch (error) {
//                     console.error("โหลดข้อมูลไม่สำเร็จ:", error);
//                 }
//             };

//             loadExpenses();
//         }, []) // ต้อง wrap ด้วย useCallback
//     );


//     const filteredExpenses = useMemo(() => {
//         if (!expenses) return [];

//         let filtered = expenses.filter((e) =>
//             dayjs(e.date).isSame(currentMonth, "month")
//         );

//         if (selectedCategory && selectedCategory !== "all") {
//             filtered = filtered.filter((e) => e.category === selectedCategory);
//         }

//         return filtered;
//     }, [currentMonth, expenses, selectedCategory]);


//     const totalThisMonth = useMemo(
//         () => filteredExpenses.reduce((sum, e) => sum + e.amount, 0),
//         [filteredExpenses]
//     );

//     const categoryTotals = useMemo(() => {
//         const totals: Record<string, number> = {};

//         filteredExpenses.forEach((expense) => {
//             if (!totals[expense.category]) {
//                 totals[expense.category] = 0;
//             }
//             totals[expense.category] += expense.amount;
//         });

//         return totals;
//     }, [filteredExpenses]);

//     // หาวันที่มีการใช้จ่ายสูงสุด
//     const maxExpenseDay = useMemo(() => {
//         if (filteredExpenses.length === 0) return null;

//         const dailyTotals: Record<string, number> = {};

//         filteredExpenses.forEach((expense) => {
//             if (!dailyTotals[expense.date]) {
//                 dailyTotals[expense.date] = 0;
//             }
//             dailyTotals[expense.date] += expense.amount;
//         });

//         let maxDay = "";
//         let maxAmount = 0;

//         Object.entries(dailyTotals).forEach(([date, amount]) => {
//             if (amount > maxAmount) {
//                 maxDay = date;
//                 maxAmount = amount;
//             }
//         });

//         return { date: maxDay, amount: maxAmount };
//     }, [filteredExpenses]);

//     const daysInMonth = useMemo(() => {
//         const days = [];
//         const startOfMonth = currentMonth.startOf("month");
//         const endOfMonth = currentMonth.endOf("month");

//         for (
//             let date = startOfMonth;
//             date.isBefore(endOfMonth) || date.isSame(endOfMonth);
//             date = date.add(1, "day")
//         ) {
//             const dateStr = date.format("YYYY-MM-DD");
//             const dayExpenses = filteredExpenses.filter((e) => e.date === dateStr);
//             const totalAmount = dayExpenses.reduce((sum, e) => sum + e.amount, 0);

//             days.push({
//                 date: dateStr,
//                 display: date.format("D MMM"),
//                 amount: totalAmount,
//                 expenses: dayExpenses,
//                 isToday: date.isSame(dayjs(), "day"),
//             });
//         }

//         return days;
//     }, [currentMonth, filteredExpenses]);

//     const handleAddExpense = () => {
//         // ในสถานการณ์จริง นี่จะนำไปยังหน้าเพิ่มค่าใช้จ่าย
//         router.push("/new"); // ไปหน้า new.tsx

//         // Alert.alert(
//         //   'เพิ่มค่าใช้จ่าย',
//         //   'ในแอปพลิเคชันจริง นี่จะนำคุณไปยังหน้าเพิ่มค่าใช้จ่ายใหม่'
//         // );
//     };

//     const handleExpensePress = (expense: Expense) => {
//         // แสดงรายละเอียดค่าใช้จ่าย
//         Alert.alert(
//             "รายละเอียดค่าใช้จ่าย",
//             `วันที่: ${dayjs(expense.date).format("D MMM YYYY")}\n` +
//             `จำนวน: ฿${expense.amount.toLocaleString()}\n` +
//             `ประเภท: ${CATEGORIES[expense.category].name}\n` +
//             `รายละเอียด: ${expense.description}`
//         );
//     };

//     const handleDayPress = (day: (typeof daysInMonth)[0]) => {
//         if (day.amount === 0) return;

//         Alert.alert(
//             `ค่าใช้จ่ายวันที่ ${dayjs(day.date).format("D MMM YYYY")}`,
//             `รวม: ฿${day.amount.toLocaleString()}`,
//             [
//                 { text: "ปิด" },
//                 {
//                     text: "ดูรายละเอียด",
//                     onPress: () => {
//                         // ในแอปจริง นี่จะนำไปยังหน้ารายละเอียดค่าใช้จ่ายรายวัน
//                         // router.push("/detail");
//                         Alert.alert("แสดงรายละเอียดค่าใช้จ่ายวันนี้");
//                     },
//                 },
//             ]
//         );
//     };
//     const backtoHome = () => {
//         router.push('/');
//     };

//     return (
//         <ScrollView style={styles.container}>
//             <HeaderCustom title="รายงานการใช้จ่าย" />
//             {/* เลือกเดือน */}
//             <View style={styles.card}>
//                 <View style={styles.monthSelector}>
//                     <Pressable onPress={handlePrevMonth} style={styles.arrowButton}>
//                         <ChevronLeft size={24} color="#007AFF" />
//                     </Pressable>
//                     <Text style={styles.monthText}>
//                         {currentMonth.format("MMMM YYYY")}
//                     </Text>
//                     <Pressable onPress={handleNextMonth} style={styles.arrowButton}>
//                         <ChevronRight size={24} color="#007AFF" />
//                     </Pressable>
//                 </View>
//             </View>

//             {/* ยอดใช้จ่ายเดือนนี้ */}
//             <View style={styles.summaryCard}>
//                 <Text style={styles.cardTitle}>ยอดใช้จ่ายเดือนนี้</Text>
//                 <Text style={styles.amount}>฿ {totalThisMonth.toLocaleString()}</Text>

//                 {/* วันที่ใช้จ่ายสูงสุด */}
//                 {maxExpenseDay && (
//                     <View style={styles.maxDayContainer}>
//                         <TrendingUp size={16} color="#FF3B30" />
//                         <Text style={styles.maxDayText}>
//                             วันที่ใช้จ่ายสูงสุด: {dayjs(maxExpenseDay.date).format("D MMM")}{" "}
//                             (฿{maxExpenseDay.amount.toLocaleString()})
//                         </Text>
//                     </View>
//                 )}
//             </View>



//             {/* แสดงรายวัน */}
//             <View style={styles.card}>
//                 <View style={styles.cardHeader}>
//                     <Text style={styles.cardTitle}>รายการรายวัน</Text>
//                     <TouchableOpacity>
//                         <CreditCard size={20} color="#007AFF" />
//                     </TouchableOpacity>
//                 </View>
//                 <Text >
//                                     กดจิ้มที่วันไหนเอารายการทั้งหมดของวันนั้นไปแสดงที่ /detail เอาแค่รายการของวันที่เราเลือกไปงับอ้วร
//                                 </Text>

//                 <View style={styles.daysList}>
//                     <ScrollView>
//                         {daysInMonth.map((day) => (
//                             <TouchableOpacity

//                                 key={day.date}
//                                 style={[styles.dayItem, day.isToday && styles.todayItem]}
//                                 onPress={() => handleDayPress(day)}
//                                 disabled={day.amount === 0} // ปิดไม่ให้กดวันที่ไม่มีการใช้จ่าย
//                             >
//                                 <Text style={[styles.dayText, day.isToday && styles.todayText]}>
//                                     {day.display}
//                                 </Text>
//                                 <Text
//                                     style={[
//                                         styles.dayAmount,
//                                         { color: day.amount > 0 ? "#FF3B30" : "#999" }, // ใช้สีแดงถ้ามีการใช้จ่าย
//                                         day.isToday && styles.todayText,
//                                     ]}
//                                 >
//                                     {day.amount > 0 ? `฿ ${day.amount.toLocaleString()}` : "-"}
//                                 </Text>
//                             </TouchableOpacity>
//                         ))}
//                     </ScrollView>
//                 </View>
//             </View>
//             <ButtonMain onPress={() => router.push('/detail')} title={`ลองเฉยๆ ไปดูวันที่ ...${currentMonth.format("MMMM")}เพิ่มเติม`} />
//             {/* สเปซด้านล่าง */}
//             <View style={styles.bottomSpace} />
//         </ScrollView>
//     );
// }

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: "#F9FAFB",
//     },
//     leftIcon: {
//         width: 40, // ความกว้างพอๆ กับพื้นที่ของ rightPlaceholder
//         alignItems: "flex-start",
//         left: 15,

//     },
//     rightPlaceholder: {
//         width: 40, // ต้องเท่ากับ leftIcon เพื่อบาลานซ์
//     },

//     header: {
//         flexDirection: "row",
//         alignItems: "center",
//         paddingTop: 50,
//         paddingBottom: 15,
//         backgroundColor: "#4a86e8",

//         // justifyContent: "center",
//         shadowColor: "#000",
//         shadowOffset: { width: 0, height: 2 },
//         shadowOpacity: 0.2,
//         shadowRadius: 2,
//         elevation: 3,
//         justifyContent: "space-between", // ให้ซ้าย-กลาง-ขวาแบ่งเท่าๆ กัน
//     },
//     title: {
//         fontSize: 22,
//         fontWeight: "bold",
//         color: "#fff",
//         textAlign: "center",
//     },
//     // header: {
//     //     flexDirection: "row",
//     //     justifyContent: "space-between",
//     //     alignItems: "center",
//     //     paddingHorizontal: 16,
//     //     paddingTop: 60,
//     //     paddingBottom: 16,
//     //     backgroundColor: "#007AFF",
//     // },
//     headerTitle: {
//         fontSize: 24,
//         fontWeight: "bold",
//         color: "#fff",
//     },
//     addButton: {
//         padding: 8,
//     },
//     card: {
//         backgroundColor: "#ffffff",
//         padding: 20,
//         borderRadius: 16,
//         marginHorizontal: 16,
//         marginTop: 16,
//         shadowColor: "#000",
//         shadowOpacity: 0.05,
//         shadowRadius: 6,
//         shadowOffset: { width: 0, height: 2 },
//         elevation: 3,
//     },
//     summaryCard: {
//         backgroundColor: "#ffffff",
//         padding: 20,
//         borderRadius: 16,
//         marginHorizontal: 16,
//         marginTop: 16,
//         shadowColor: "#000",
//         shadowOpacity: 0.05,
//         shadowRadius: 6,
//         shadowOffset: { width: 0, height: 2 },
//         elevation: 3,
//     },
//     cardHeader: {
//         flexDirection: "row",
//         justifyContent: "space-between",
//         alignItems: "center",
//         marginBottom: 12,
//     },
//     cardTitle: {
//         fontSize: 18,
//         color: "#555",
//         marginBottom: 12,
//     },
//     amount: {
//         fontSize: 36,
//         fontWeight: "bold",
//         color: "#FF3B30",
//         marginBottom: 8,
//     },
//     maxDayContainer: {
//         flexDirection: "row",
//         alignItems: "center",
//         marginTop: 8,
//     },
//     maxDayText: {
//         fontSize: 14,
//         color: "#666",
//         marginLeft: 8,
//     },
//     monthSelector: {
//         flexDirection: "row",
//         alignItems: "center",
//         justifyContent: "space-between",
//     },
//     arrowButton: {
//         padding: 8,
//     },
//     monthText: {
//         fontSize: 20,
//         fontWeight: "600",
//         color: "#333",
//     },
//     categoryScroll: {
//         flexDirection: "row",
//         marginBottom: 16,
//     },
//     categoryChip: {
//         paddingHorizontal: 16,
//         paddingVertical: 8,
//         borderRadius: 20,
//         marginRight: 8,
//         borderWidth: 1,
//         borderColor: "#8E8E93",
//     },
//     categoryChipText: {
//         fontSize: 14,
//         fontWeight: "500",
//         color: "#8E8E93",
//     },
//     categoryStats: {
//         marginTop: 8,
//     },
//     categoryStat: {
//         flexDirection: "row",
//         alignItems: "center",
//         marginBottom: 8,
//     },
//     categoryDot: {
//         width: 10,
//         height: 10,
//         borderRadius: 5,
//         marginRight: 8,
//     },
//     categoryStatText: {
//         fontSize: 14,
//         color: "#333",
//     },
//     daysList: {
//         maxHeight: 300,
//     },
//     dayItem: {
//         flexDirection: "row",
//         justifyContent: "space-between",
//         paddingVertical: 10,
//         borderBottomWidth: 0.5,
//         borderBottomColor: "#eee",
//     },
//     todayItem: {
//         backgroundColor: "#007AFF15",
//         borderRadius: 8,
//         paddingHorizontal: 8,
//         marginHorizontal: -8,
//     },
//     dayText: {
//         fontSize: 16,
//         color: "#333",
//     },
//     todayText: {
//         color: "#007AFF",
//         fontWeight: "600",
//     },
//     dayAmount: {
//         fontSize: 16,
//         fontWeight: "500",
//     },
//     expenseItem: {
//         flexDirection: "row",
//         justifyContent: "space-between",
//         alignItems: "center",
//         paddingVertical: 12,
//         borderBottomWidth: 0.5,
//         borderBottomColor: "#eee",
//     },
//     expenseLeft: {
//         flexDirection: "row",
//         alignItems: "center",
//     },
//     expenseIcon: {
//         width: 32,
//         height: 32,
//         borderRadius: 16,
//         justifyContent: "center",
//         alignItems: "center",
//         marginRight: 12,
//     },
//     expenseDescription: {
//         fontSize: 16,
//         color: "#333",
//     },
//     expenseDate: {
//         fontSize: 12,
//         color: "#999",
//         marginTop: 2,
//     },
//     expenseAmount: {
//         fontSize: 16,
//         fontWeight: "600",
//         color: "#FF3B30",
//     },
//     emptyText: {
//         fontSize: 16,
//         color: "#999",
//         textAlign: "center",
//         paddingVertical: 20,
//     },
//     seeAllButton: {
//         flexDirection: "row",
//         justifyContent: "center",
//         alignItems: "center",
//         paddingVertical: 12,
//         marginTop: 8,
//     },
//     seeAllText: {
//         fontSize: 14,
//         fontWeight: "500",
//         color: "#007AFF",
//         marginRight: 4,
//     },
//     quickActions: {
//         flexDirection: "row",
//         justifyContent: "space-between",
//         paddingHorizontal: 16,
//         marginTop: 16,
//     },
//     quickAction: {
//         alignItems: "center",
//         width: (width - 32) / 4 - 8,
//     },
//     quickActionIcon: {
//         width: 44,
//         height: 44,
//         borderRadius: 22,
//         justifyContent: "center",
//         alignItems: "center",
//         marginBottom: 8,
//     },
//     quickActionText: {
//         fontSize: 12,
//         color: "#333",
//     },
//     bottomSpace: {
//         height: 100,
//     },
// });


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
  
  const API_BACKEND = Constants.expoConfig?.extra?.API_BACKEND;
  const router = useRouter();
  
  const handlePrevMonth = () => setCurrentMonth((prev) => prev.subtract(1, "month"));
  const handleNextMonth = () => setCurrentMonth((prev) => prev.add(1, "month"));

  useFocusEffect(
    useCallback(() => {
      const loadExpenses = async () => {
        setIsLoading(true);
        try {
          const response = await axios.get(API_BACKEND + "/tranfers");
          const data = response.data;
          
          const formattedExpenses: Expense[] = data.map((item: any) => ({
            id: item.id,
            date: item.date || dayjs(item.created_at).format("YYYY-MM-DD"),
            amount: item.amount,
            typeTranfer: item.typeTranfer || "อื่นๆ",
            detail: item.detail || "",
            sender: item.sender || "เงินสด",
            recipient: item.recipient || "",
          }));
          
          setExpenses(formattedExpenses);
        } catch (error) {
          console.error("โหลดข้อมูลไม่สำเร็จ:", error);
          Alert.alert("เกิดข้อผิดพลาด", "ไม่สามารถโหลดข้อมูลรายจ่ายได้");
        } finally {
          setIsLoading(false);
        }
      };

      loadExpenses();
    }, [])
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

  const totalThisMonth = useMemo(
    () => filteredExpenses.reduce((sum, e) => sum + e.amount, 0),
    [filteredExpenses]
  );

  const expenseTypes = useMemo(() => {
    if (!expenses) return [];
    
    const types = new Set<string>();
    expenses.forEach(expense => {
      if (expense.typeTranfer) {
        types.add(expense.typeTranfer);
      }
    });
    
    return Array.from(types);
  }, [expenses]);

  const typeBreakdown = useMemo(() => {
    if (!filteredExpenses.length) return {};

    const breakdown: Record<string, number> = {};
    
    filteredExpenses.forEach(expense => {
      const type = expense.typeTranfer || "อื่นๆ";
      if (!breakdown[type]) {
        breakdown[type] = 0;
      }
      breakdown[type] += expense.amount;
    });
    
    return breakdown;
  }, [filteredExpenses]);

  // หาวันที่มีการใช้จ่ายสูงสุด
  const maxExpenseDay = useMemo(() => {
    if (!filteredExpenses.length) return null;

    const dailyTotals: Record<string, number> = {};

    filteredExpenses.forEach((expense) => {
      if (!dailyTotals[expense.date]) {
        dailyTotals[expense.date] = 0;
      }
      dailyTotals[expense.date] += expense.amount;
    });

    let maxDay = "";
    let maxAmount = 0;

    Object.entries(dailyTotals).forEach(([date, amount]) => {
      if (amount > maxAmount) {
        maxDay = date;
        maxAmount = amount;
      }
    });

    return { date: maxDay, amount: maxAmount };
  }, [filteredExpenses]);

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
      const dayExpenses = filteredExpenses.filter((e) => e.date === dateStr);
      const totalAmount = dayExpenses.reduce((sum, e) => sum + e.amount, 0);

      days.push({
        date: dateStr,
        display: date.format("D MMM"),
        amount: totalAmount,
        expenses: dayExpenses,
        isToday: date.isSame(dayjs(), "day"),
      });
    }

    return days;
  }, [currentMonth, filteredExpenses]);

  const handleDayPress = (day: (typeof daysInMonth)[0]) => {
    if (day.amount === 0) return;

    router.push({
      pathname: "/detail",
      params: { date: day.date, displayDate: day.display }
    });
  };

  const getColorForType = (type: string) => {
    return EXPENSE_TYPES[type as keyof typeof EXPENSE_TYPES]?.color || "#8E8E93";
  };

  const getIconForType = (type: string) => {
    return EXPENSE_TYPES[type as keyof typeof EXPENSE_TYPES]?.icon || "📋";
  };

  return (
    <View className="flex-1 bg-gray-50">
      <HeaderCustom title="รายงานการใช้จ่าย" />
      
      
      <ScrollView className="flex-1">
        {/* เลือกเดือน */}
        <View className="bg-white rounded-xl shadow-sm mx-4 mt-4 p-4">
          <View className="flex-row justify-between items-center">
            <TouchableOpacity 
              className="p-2 rounded-full bg-gray-100" 
              onPress={handlePrevMonth}
            >
              <ChevronLeft size={24} color="#4a86e8" />
            </TouchableOpacity>
            
            <View className="flex-row items-center">
              <Calendar size={18} color="#4a86e8" className="mr-2" />
              <Text className="text-lg font-semibold text-gray-800">
                {currentMonth.format("MMMM YYYY")}
              </Text>
            </View>
            
            <TouchableOpacity 
              className="p-2 rounded-full bg-gray-100" 
              onPress={handleNextMonth}
            >
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
              {totalThisMonth.toLocaleString()}
            </Text>
            
            {selectedType && (
              <View className="ml-3 bg-blue-100 px-3 py-1 rounded-full">
                <Text className="text-blue-600 font-medium text-sm">
                  {selectedType}
                </Text>
              </View>
            )}
          </View>

          {/* วันที่ใช้จ่ายสูงสุด */}
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
              <TouchableOpacity 
                className="flex-row items-center" 
                onPress={() => setSelectedType(null)}
              >
                <Text className="text-blue-500 text-sm mr-1">ดูทั้งหมด</Text>
                <Filter size={14} color="#4a86e8" />
              </TouchableOpacity>
            )}
          </View>

          {/* ปุ่มเลือกประเภท */}
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            className="mb-4"
          >
            {expenseTypes.map((type) => (
              <TouchableOpacity
                key={type}
                className={`mr-2 px-4 py-2 rounded-full flex-row items-center ${
                  selectedType === type 
                    ? "bg-blue-500" 
                    : "bg-gray-100"
                }`}
                onPress={() => setSelectedType(type === selectedType ? null : type)}
              >
                <Text className="mr-2">{getIconForType(type)}</Text>
                <Text 
                  className={`${
                    selectedType === type 
                      ? "text-white" 
                      : "text-gray-700"
                  } font-medium`}
                >
                  {type}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* แสดงผลรวมแต่ละประเภท */}
          {Object.keys(typeBreakdown).length > 0 ? (
            <View className="mb-2">
              {Object.entries(typeBreakdown).map(([type, amount]) => (
                <View key={type} className="flex-row justify-between items-center mb-3">
                  <View className="flex-row items-center">
                    <View 
                      style={{backgroundColor: getColorForType(type)}}
                      className="w-3 h-3 rounded-full mr-3"
                    />
                    <Text className="text-gray-700">{type}</Text>
                  </View>
                  <Text className="font-semibold text-gray-800">
                    ฿{amount.toLocaleString()}
                  </Text>
                </View>
              ))}
            </View>
          ) : (
            <Text className="text-gray-500 text-center py-4">
              ไม่มีข้อมูลรายจ่ายในเดือนนี้
            </Text>
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
                className={`flex-row justify-between py-3 px-2 border-b border-gray-100 ${
                  day.isToday ? "bg-blue-50 rounded-lg" : ""
                }`}
                onPress={() => handleDayPress(day)}
                disabled={day.amount === 0}
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
                  <Text
                    className={`${
                      day.amount > 0 
                        ? "text-red-500 font-semibold" 
                        : "text-gray-400"
                    }`}
                  >
                    {day.amount > 0 ? `฿${day.amount.toLocaleString()}` : "-"}
                  </Text>
                  {day.amount > 0 && (
                    <ArrowRight size={16} color="#4a86e8" className="ml-1" />
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity 
            className="mt-3 py-3 bg-blue-500 rounded-lg flex-row justify-center items-center"
            onPress={() => router.push("/detail")}
          >
            <Text className="text-white font-medium">ดูรายการทั้งหมด</Text>
            <ArrowUpRight size={16} color="#ffffff" className="ml-1" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}