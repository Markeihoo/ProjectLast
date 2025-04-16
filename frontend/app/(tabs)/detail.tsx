import { Text, View, ScrollView, TouchableOpacity } from "react-native";
import HeaderCustom from "../components/header";
import PaginationCustom from "../components/pagination";
import { ItemCardMain } from "../components/itemCard";
import { ChevronLeft, ChevronRight, PlusCircle, TrendingUp, CreditCard, DollarSign, ArrowDownCircle, ArrowUpCircle, PieChart, ArrowLeft, } from "lucide-react-native";
import { useState } from 'react';
import { router } from "expo-router";
import { ButtonMain } from "../components/button";

export default function detail() {

    const [page, setPage] = useState(1);
    const totalPages = 4;

    const handlePrev = () => {
        if (page > 1) setPage(page - 1);
    };

    const handleNext = () => {
        if (page < totalPages) setPage(page + 1);
    };

    return (
        <View style={{ flex: 1 }}>
            <HeaderCustom title={`รายละเอียดการใช้จ่าย\nวันที่ 17/4/68`} />
            <View className="flex-row justify-between bg-blue-100 p-4 ">
                    <Text >ยอดใช้จ่ายวันที่......</Text>
                    <Text >฿ กี่บาทท</Text>

                    {/* วันที่ใช้จ่ายสูงสุด */}
                    {/* {maxExpenseDay && ( */}
                    {/* )} */}
                </View>
                <Text className="text-base mb-4">แสดงรายการทั้งหมดของเดือนนั้นตาม created_at วันเดียว...เท่านั้น </Text>
            <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 30 }}>
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
                page={page}
                totalPages={totalPages}
                handlePrev={handlePrev}
                handleNext={handleNext}
            />
        </View>
    );
}
