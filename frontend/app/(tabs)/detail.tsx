import { Text, View, ScrollView, ActivityIndicator } from "react-native";
import HeaderCustom from "../components/header";
import PaginationCustom from "../components/pagination";
import { ItemCardMain } from "../components/itemCard";
import { useState, useEffect } from 'react';
import { useLocalSearchParams } from "expo-router";
import Constants from 'expo-constants';
import dayjs from "dayjs";
import "dayjs/locale/th";
import buddhistEra from "dayjs/plugin/buddhistEra";
import localizedFormat from "dayjs/plugin/localizedFormat";

dayjs.locale("th");
dayjs.extend(buddhistEra);
dayjs.extend(localizedFormat);
type TransferItem = {
    id: string;
    amount: number;
    sender: string;
    recipient: string;
    date: string;
    time: string;
    slip_ref: string;
    detail: string;
    typeTranfer: string | null;
    created_at: string;
    updated_at: string;
};

export default function DetailScreen() {
    const { date, displayDate } = useLocalSearchParams<{ date: string; displayDate: string }>();
    const API_BACKEND = Constants.expoConfig?.extra?.API_BACKEND;

    const [data, setData] = useState<TransferItem[]>([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const res = await fetch(`${API_BACKEND}/tranfersByDate?date=${date}`);
                const json = await res.json();
                setData(json);
            } catch (err) {
                console.error("Error fetching data:", err);
            } finally {
                setLoading(false);
            }
        };

        if (date) fetchData();
    }, [date]);

    const totalAmount = (data ?? []).reduce((sum, item) => sum + (item.amount ?? 0), 0);

    return (
        <View style={{ flex: 1 }}>
            <HeaderCustom title={`รายละเอียดการใช้จ่าย\n${dayjs(date).format("D MMM BBBB")}`} />
            <View className="flex-row justify-between items-center bg-blue-100 px-6 py-4 rounded-xl shadow-sm mb-4">
                <View>
                    <Text className="text-base">ยอดใช้จ่ายวันที่</Text>
                    <Text className="text-lg font-semibold text-blue-800">{dayjs(date).format("D MMM BBBB")}</Text>
                </View>
                <View className="items-end">
                    <Text className="text-base text-gray-700">รวมทั้งหมด</Text>
                    <Text className="text-xl font-bold text-green-600">
                        💰 {totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </Text>
                </View>
            </View>

            <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 30 }}>
                {loading ? (
                    <ActivityIndicator size="large" color="#0000ff" />
                ) : (
                    data.map((item: any) => (
                        <ItemCardMain
                            key={item.id}
                            amount={item.amount || 0}
                            typeTranfer={item.typeTranfer ?? ""}
                            date={item.date}
                            time={item.time}
                            sender={item.sender ?? "ไม่ระบุ"}
                            recipient={item.recipient ?? "ไม่ระบุ"}
                            detail={item.detail || "ไม่มีรายละเอียด"}
                            titleBtn="ลบ"
                            btnColor="danger"
                            onPress={() => { }}
                        />
                    ))
                )}
            </ScrollView>

        </View>
    );
}
