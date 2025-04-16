// import { Text, View } from "react-native";

// export default function Index() {
//   return (
//     <View
//       style={{
//         flex: 1,
//         justifyContent: "center",
//         alignItems: "center",
//       }}
//     >
//       <Text>Edit app/index.tsx to edit this screen.</Text>
//     </View>
//   );
// }
import React, { useState, useMemo, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Pressable, 
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Alert
} from 'react-native';
import { 
  ChevronLeft, 
  ChevronRight, 
  PlusCircle, 
  TrendingUp, 
  CreditCard, 
  DollarSign,
  ArrowDownCircle,
  ArrowUpCircle,
  PieChart,
  ArrowLeft
} from 'lucide-react-native';
import dayjs from 'dayjs';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

// ประเภทค่าใช้จ่าย
const CATEGORIES = {
  food: { name: 'อาหาร', color: '#FF9500' },
  transport: { name: 'เดินทาง', color: '#5856D6' },
  shopping: { name: 'ช้อปปิ้ง', color: '#FF2D55' },
  bills: { name: 'บิล/ค่างวด', color: '#007AFF' },
  entertainment: { name: 'บันเทิง', color: '#AF52DE' },
  health: { name: 'สุขภาพ', color: '#34C759' },
  other: { name: 'อื่นๆ', color: '#8E8E93' },
};

interface Expense {
  id: string;
  date: string; // format: YYYY-MM-DD
  amount: number;
  category: keyof typeof CATEGORIES;
  description: string;
}

// ข้อมูลตัวอย่าง (เพิ่มเติมจากเดิม)
const sampleExpenses: Expense[] = [
  { id: '1', date: '2025-04-13', amount: 5000, category: 'shopping', description: 'ช้อปปิ้งเสื้อผ้า' },
  { id: '2', date: '2025-04-02', amount: 1200, category: 'food', description: 'ร้านอาหารกับครอบครัว' },
  { id: '3', date: '2025-04-10', amount: 800, category: 'transport', description: 'ค่าแท็กซี่' },
  { id: '4', date: '2025-03-25', amount: 700, category: 'bills', description: 'ค่าน้ำ ค่าไฟ' },
  { id: '5', date: '2025-04-15', amount: 350, category: 'food', description: 'อาหารกลางวัน' },
  { id: '6', date: '2025-04-20', amount: 1500, category: 'entertainment', description: 'ตั๋วหนัง' },
  { id: '7', date: '2025-04-05', amount: 2200, category: 'health', description: 'ยา' },
  { id: '8', date: '2025-04-18', amount: 900, category: 'bills', description: 'ค่าโทรศัพท์' },
  { id: '9', date: '2025-04-22', amount: 450, category: 'transport', description: 'ค่าน้ำมัน' },
  { id: '10', date: '2025-04-30', amount: 3500, category: 'shopping', description: 'ของใช้ในบ้าน' },
  { id: '11', date: '2025-03-15', amount: 4200, category: 'bills', description: 'ค่าเช่า' },
  { id: '12', date: '2025-03-10', amount: 2800, category: 'other', description: 'ซ่อมรถ' },
];

export default function HomeScreen() {
  const [expenses, setExpenses] = useState<Expense[]>(sampleExpenses);
  const [currentMonth, setCurrentMonth] = useState(dayjs());
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const handlePrevMonth = () => setCurrentMonth((prev) => prev.subtract(1, 'month'));
  const handleNextMonth = () => setCurrentMonth((prev) => prev.add(1, 'month'));

  const router = useRouter();



  const filteredExpenses = useMemo(() => {
    let filtered = expenses.filter((e) =>
      dayjs(e.date).isSame(currentMonth, 'month')
    );
    
    if (selectedCategory && selectedCategory !== 'all') {
      filtered = filtered.filter(e => e.category === selectedCategory);
    }
    
    return filtered;
  }, [currentMonth, expenses, selectedCategory]);

  const totalThisMonth = useMemo(() => 
    filteredExpenses.reduce((sum, e) => sum + e.amount, 0),
  [filteredExpenses]);
  
  const categoryTotals = useMemo(() => {
    const totals: Record<string, number> = {};
    
    filteredExpenses.forEach(expense => {
      if (!totals[expense.category]) {
        totals[expense.category] = 0;
      }
      totals[expense.category] += expense.amount;
    });
    
    return totals;
  }, [filteredExpenses]);
  
  // หาวันที่มีการใช้จ่ายสูงสุด
  const maxExpenseDay = useMemo(() => {
    if (filteredExpenses.length === 0) return null;
    
    const dailyTotals: Record<string, number> = {};
    
    filteredExpenses.forEach(expense => {
      if (!dailyTotals[expense.date]) {
        dailyTotals[expense.date] = 0;
      }
      dailyTotals[expense.date] += expense.amount;
    });
    
    let maxDay = '';
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
    const startOfMonth = currentMonth.startOf('month');
    const endOfMonth = currentMonth.endOf('month');

    for (let date = startOfMonth; date.isBefore(endOfMonth) || date.isSame(endOfMonth); date = date.add(1, 'day')) {
      const dateStr = date.format('YYYY-MM-DD');
      const dayExpenses = filteredExpenses.filter(e => e.date === dateStr);
      const totalAmount = dayExpenses.reduce((sum, e) => sum + e.amount, 0);
      
      days.push({
        date: dateStr,
        display: date.format('D MMM'),
        amount: totalAmount,
        expenses: dayExpenses,
        isToday: date.isSame(dayjs(), 'day')
      });
    }

    return days;
  }, [currentMonth, filteredExpenses]);

  const handleAddExpense = () => {
    // ในสถานการณ์จริง นี่จะนำไปยังหน้าเพิ่มค่าใช้จ่าย
    router.push('/new'); // ไปหน้า new.tsx
  
    // Alert.alert(
    //   'เพิ่มค่าใช้จ่าย',
    //   'ในแอปพลิเคชันจริง นี่จะนำคุณไปยังหน้าเพิ่มค่าใช้จ่ายใหม่'
    // );
  };

  const handleExpensePress = (expense: Expense) => {
    // แสดงรายละเอียดค่าใช้จ่าย
    Alert.alert(
      'รายละเอียดค่าใช้จ่าย',
      `วันที่: ${dayjs(expense.date).format('D MMM YYYY')}\n` +
      `จำนวน: ฿${expense.amount.toLocaleString()}\n` +
      `ประเภท: ${CATEGORIES[expense.category].name}\n` +
      `รายละเอียด: ${expense.description}`
    );
  };

  const handleDayPress = (day: typeof daysInMonth[0]) => {
    if (day.amount === 0) return;

    Alert.alert(
      `ค่าใช้จ่ายวันที่ ${dayjs(day.date).format('D MMM YYYY')}`,
      `รวม: ฿${day.amount.toLocaleString()}`,
      [
        { text: 'ปิด' },
        { 
          text: 'ดูรายละเอียด', 
          onPress: () => {
            // ในแอปจริง นี่จะนำไปยังหน้ารายละเอียดค่าใช้จ่ายรายวัน
            Alert.alert('แสดงรายละเอียดค่าใช้จ่ายวันนี้');
          }
        }
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      {/* ส่วนหัว */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>บัญชีรายจ่าย</Text>
        <TouchableOpacity 
          style={styles.addButton} 
          onPress={handleAddExpense}
        >
          <PlusCircle size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* เลือกเดือน */}
      <View style={styles.card}>
        <View style={styles.monthSelector}>
          <Pressable onPress={handlePrevMonth} style={styles.arrowButton}>
            <ChevronLeft size={24} color="#007AFF" />
          </Pressable>
          <Text style={styles.monthText}>{currentMonth.format('MMMM YYYY')}</Text>
          <Pressable onPress={handleNextMonth} style={styles.arrowButton}>
            <ChevronRight size={24} color="#007AFF" />
          </Pressable>
        </View>
      </View>

      {/* ยอดใช้จ่ายเดือนนี้ */}
      <View style={styles.summaryCard}>
        <Text style={styles.cardTitle}>ยอดใช้จ่ายเดือนนี้</Text>
        <Text style={styles.amount}>฿ {totalThisMonth.toLocaleString()}</Text>
        
        {/* วันที่ใช้จ่ายสูงสุด */}
        {maxExpenseDay && (
          <View style={styles.maxDayContainer}>
            <TrendingUp size={16} color="#FF3B30" />
            <Text style={styles.maxDayText}>
              วันที่ใช้จ่ายสูงสุด: {dayjs(maxExpenseDay.date).format('D MMM')} (฿{maxExpenseDay.amount.toLocaleString()})
            </Text>
          </View>
        )}
      </View>

      {/* กราฟวงกลมแสดงสัดส่วนค่าใช้จ่าย */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>สัดส่วนค่าใช้จ่าย</Text>
          <TouchableOpacity onPress={() => setSelectedCategory(null)}>
            <PieChart size={20} color="#007AFF" />
          </TouchableOpacity>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
          <TouchableOpacity 
            style={[
              styles.categoryChip, 
              selectedCategory === 'all' && { backgroundColor: '#007AFF' }
            ]}
            onPress={() => setSelectedCategory('all')}
          >
            <Text style={[
              styles.categoryChipText,
              selectedCategory === 'all' && { color: '#fff' }
            ]}>ทั้งหมด</Text>
          </TouchableOpacity>
          
          {Object.entries(CATEGORIES).map(([key, value]) => (
            <TouchableOpacity 
              key={key}
              style={[
                styles.categoryChip, 
                { borderColor: value.color },
                selectedCategory === key && { backgroundColor: value.color }
              ]}
              onPress={() => setSelectedCategory(prev => prev === key ? null : key)}
            >
              <Text style={[
                styles.categoryChipText,
                { color: value.color },
                selectedCategory === key && { color: '#fff' }
              ]}>{value.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.categoryStats}>
          {Object.entries(categoryTotals).map(([category, total]) => (
            <View key={category} style={styles.categoryStat}>
              <View style={styles.categoryDot} backgroundColor={CATEGORIES[category as keyof typeof CATEGORIES].color} />
              <Text style={styles.categoryStatText}>
                {CATEGORIES[category as keyof typeof CATEGORIES].name}: ฿{total.toLocaleString()}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* แสดงรายวัน */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>รายการรายวัน</Text>
          <TouchableOpacity>
            <CreditCard size={20} color="#007AFF" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.daysList}>
          <ScrollView>
          {daysInMonth.map((day) => (
            <TouchableOpacity 
              key={day.date} 
              style={[
                styles.dayItem,
                day.isToday && styles.todayItem
              ]}
              onPress={() => handleDayPress(day)}
              disabled={day.amount === 0}
            >
              <Text style={[
                styles.dayText,
                day.isToday && styles.todayText
              ]}>
                {day.display}
              </Text>
              <Text style={[
                styles.dayAmount, 
                { color: day.amount > 0 ? '#FF3B30' : '#999' },
                day.isToday && styles.todayText
              ]}>
                {day.amount > 0 ? `฿ ${day.amount.toLocaleString()}` : '-'}
              </Text>
            </TouchableOpacity>
          ))}
          </ScrollView>
        </View>
      </View>

      {/* รายการล่าสุด */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>รายการล่าสุด</Text>
          <TouchableOpacity>
            <DollarSign size={20} color="#007AFF" />
          </TouchableOpacity>
        </View>
        
        {filteredExpenses.length > 0 ? (
          filteredExpenses
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .slice(0, 5)
            .map((expense) => (
              <TouchableOpacity 
                key={expense.id} 
                style={styles.expenseItem}
                onPress={() => handleExpensePress(expense)}
              >
                <View style={styles.expenseLeft}>
                  <View style={[styles.expenseIcon, { backgroundColor: CATEGORIES[expense.category].color }]}>
                    <ArrowUpCircle size={16} color="#fff" />
                  </View>
                  <View>
                    <Text style={styles.expenseDescription}>{expense.description}</Text>
                    <Text style={styles.expenseDate}>{dayjs(expense.date).format('D MMM YYYY')}</Text>
                  </View>
                </View>
                <Text style={styles.expenseAmount}>฿{expense.amount.toLocaleString()}</Text>
              </TouchableOpacity>
            ))
        ) : (
          <Text style={styles.emptyText}>ไม่มีรายการในเดือนนี้</Text>
        )}
        
        {filteredExpenses.length > 5 && (
          <TouchableOpacity style={styles.seeAllButton}>
            <Text style={styles.seeAllText}>ดูทั้งหมด</Text>
            <ChevronRight size={16} color="#007AFF" />
          </TouchableOpacity>
        )}
      </View>
      
      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <TouchableOpacity style={styles.quickAction}>
          <View style={[styles.quickActionIcon, { backgroundColor: '#5856D6' }]}>
            <TrendingUp size={20} color="#fff" />
          </View>
          <Text style={styles.quickActionText}>วิเคราะห์</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.quickAction}>
          <View style={[styles.quickActionIcon, { backgroundColor: '#34C759' }]}>
            <ArrowDownCircle size={20} color="#fff" />
          </View>
          <Text style={styles.quickActionText}>รายรับ</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.quickAction}>
          <View style={[styles.quickActionIcon, { backgroundColor: '#FF3B30' }]}>
            <ArrowUpCircle size={20} color="#fff" />
          </View>
          <Text style={styles.quickActionText}>รายจ่าย</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.quickAction}>
          <View style={[styles.quickActionIcon, { backgroundColor: '#FF9500' }]}>
            <PieChart size={20} color="#fff" />
          </View>
          <Text style={styles.quickActionText}>รายงาน</Text>
        </TouchableOpacity>
      </View>
      
      {/* สเปซด้านล่าง */}
      <View style={styles.bottomSpace} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: '#007AFF',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  addButton: {
    padding: 8,
  },
  card: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 16,
    marginHorizontal: 16,
    marginTop: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  summaryCard: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 16,
    marginHorizontal: 16,
    marginTop: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 18,
    color: '#555',
    marginBottom: 12,
  },
  amount: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FF3B30',
    marginBottom: 8,
  },
  maxDayContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  maxDayText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  monthSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  arrowButton: {
    padding: 8,
  },
  monthText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },
  categoryScroll: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#8E8E93',
  },
  categoryChipText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#8E8E93',
  },
  categoryStats: {
    marginTop: 8,
  },
  categoryStat: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  categoryStatText: {
    fontSize: 14,
    color: '#333',
  },
  daysList: {
    maxHeight: 300,
  },
  dayItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: '#eee',
  },
  todayItem: {
    backgroundColor: '#007AFF15',
    borderRadius: 8,
    paddingHorizontal: 8,
    marginHorizontal: -8,
  },
  dayText: {
    fontSize: 16,
    color: '#333',
  },
  todayText: {
    color: '#007AFF',
    fontWeight: '600',
  },
  dayAmount: {
    fontSize: 16,
    fontWeight: '500',
  },
  expenseItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: '#eee',
  },
  expenseLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  expenseIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  expenseDescription: {
    fontSize: 16,
    color: '#333',
  },
  expenseDate: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  expenseAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF3B30',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    paddingVertical: 20,
  },
  seeAllButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    marginTop: 8,
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#007AFF',
    marginRight: 4,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginTop: 16,
  },
  quickAction: {
    alignItems: 'center',
    width: (width - 32) / 4 - 8,
  },
  quickActionIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  quickActionText: {
    fontSize: 12,
    color: '#333',
  },
  bottomSpace: {
    height: 100,
  },
});