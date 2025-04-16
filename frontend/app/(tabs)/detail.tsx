import { Text, View, ScrollView, TouchableOpacity } from "react-native";
import HeaderCustom from "../components/header";
import PaginationCustom from "../components/pagination";
import { ItemCardMain } from "../components/itemCard";
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
    ArrowLeft,
} from "lucide-react-native";
export default function detail() {

    return (
        <>
            <HeaderCustom title={`รายละเอียดการใช้จ่าย\nวันที่ 17/4/68`} />
            <View className="p-4">
                <View className="flex-row justify-between bg-white p-4 rounded-xl">
                    <Text >ยอดใช้จ่ายวันที่......</Text>
                    <Text >฿ กี่บาทท</Text>

                    {/* วันที่ใช้จ่ายสูงสุด */}
                    {/* {maxExpenseDay && ( */}
                    {/* )} */}
                </View>
                <Text className="text-base mb-4">แสดงรายการทั้งหมดของเดือนนั้นตาม created_at แค่เดือน...เท่านั้น </Text>
                <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 30 }}>
                    {/* <ButtonMain title="เพิ่มรายการใหม่" btnSize="full" className="mb-4" onPress={() => router.push('/new')} /> */}
                    {Array.from({ length: 4 }).map((_, index) => (
                        <ItemCardMain
                            key={index}
                            amount={10}
                            typeTranfer="โอนเงิน"
                            date="2023-08-01"
                            time="10:00"
                            sender="John Doe"
                            recipient="Jane Smith"
                            detail="รายละเอียดเพิ่มเติม"
                            titleBtn="ลบ"
                            btnColor="danger"
                            onPress={() => { }}
                        />
                    ))}
                </ScrollView>
                <PaginationCustom
                    page={1}
                    totalPages={4}
                    handlePrev={() => { }}
                    handleNext={() => { }}
                />
            </View>
        </>
    )
}