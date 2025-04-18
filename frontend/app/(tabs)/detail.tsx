import PaginationCustom from "../components/pagination";
import ItemCardMain from "../components/itemCard";
import { useLocalSearchParams } from "expo-router";
import Constants from 'expo-constants';
import dayjs from "dayjs";
import "dayjs/locale/th";
import buddhistEra from "dayjs/plugin/buddhistEra";
import localizedFormat from "dayjs/plugin/localizedFormat";
import { View, Text, Modal, TextInput, ScrollView, Button, Alert, ActivityIndicator, TouchableOpacity } from "react-native";
import HeaderCustom from "@/app/components/header";
import React, { useState, useCallback, useEffect } from "react";
import { ButtonMain } from "../components/button";
import { router } from "expo-router";
import axios from "axios";
import { CustomInput } from "@/app/components/customInput";
import { ArrowLeft, Plus, DollarSign, Calendar, Clock, Tag, FileText, } from "lucide-react-native";
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
const categories = [
    { name: "ค่าอาหาร", icon: "🍲", color: "#FF9500" },
    { name: "ค่ายา", icon: "💊", color: "#34C759" },
    { name: "ค่าท่องเที่ยว", icon: "🏖️", color: "#5856D6" },
    { name: "ค่าน้ำค่าไฟ", icon: "💡", color: "#007AFF" },
    { name: "อื่นๆ", icon: "📋", color: "#8E8E93" },
];
export default function DetailScreen() {
    const [tranfers, setTranfers] = useState<any[]>([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isModalVisibleDelete, setIsModalVisibleDelete] = useState(false);
    const [selectedTranfer, setSelectedTranfer] = useState<any>(null);

    const { date, displayDate } = useLocalSearchParams<{ date: string; displayDate: string }>();
    const API_BACKEND = Constants.expoConfig?.extra?.API_BACKEND;

    const [data, setData] = useState<TransferItem[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchDataByDate = async (date: string) => {
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

    useEffect(() => {
        if (date) {
            fetchDataByDate(date);
        }
    }, [date]);


    const totalAmount = (data ?? []).reduce((sum, item) => sum + (item.amount ?? 0), 0);

    const handleDeleteConfirm = (id: string) => {
        try {
            axios.delete(`${API_BACKEND}/tranfers/${id}`).then(() => {
                setTranfers((prev) => prev.filter((t) => t.id !== id));
                setIsModalVisibleDelete(false);
                fetchDataByDate(date);
            });
        } catch (error) {
            console.error("Error deleting tranfer:", error);
        }
    };

    const handleEdit = (tranfer: any) => {
        setSelectedTranfer(tranfer);
        setIsModalVisible(true);
    };
    const handleDelete = (id: string) => {
        setSelectedTranfer(id);
        setIsModalVisibleDelete(true);
    };

    const closeModal = () => {
        setSelectedTranfer(null);
        setIsModalVisible(false);
    };

    const closeModalDelete = () => {
        setSelectedTranfer(null);
        setIsModalVisibleDelete(false);
    };

    const handleUpdateConfirm = () => {
        if (!selectedTranfer?.id) return;
        const data = {
            date: selectedTranfer.date,
            time: selectedTranfer.time,
            sender: selectedTranfer.sender,
            amount: selectedTranfer.amount,
            typeTranfer: selectedTranfer.typeTranfer,
            detail: selectedTranfer.detail,
            recipient: selectedTranfer.recipient,
        };
        axios
            .put(`${API_BACKEND}/tranfers/${selectedTranfer.id}`, data)
            .then(() => {
                setTranfers((prev) =>
                    prev.map((t) =>
                        t.id === selectedTranfer.id
                            ? { ...t, ...data }
                            : t
                    )
                );
                setIsModalVisible(false);
                fetchDataByDate(date);
            })
            .catch((error) => {
                console.error("Error updating tranfer:", error);
            });
    };

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
                ) : data.length === 0 ? (
                    <View className="items-center mt-10">
                        <Text className="text-gray-500 text-base">ไม่มีข้อมูลรายจ่ายเดือนนี้</Text>
                    </View>
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
                            detail={item.detail || "-"}
                            onDelete={() => handleDelete(item)}
                            onEdit={() => handleEdit(item)}
                        />
                    ))
                )}
            </ScrollView>

            {/* แก้ */}
            <Modal visible={isModalVisible}
                onRequestClose={closeModal}
                animationType="slide"
                transparent={true}
            >
                <View style={{ flex: 1, justifyContent: "center", backgroundColor: "rgba(0,0,0,0.4)", padding: 30 }}>
                    <View style={{ backgroundColor: "white", padding: 25, borderRadius: 10 }}>
                        <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 10 }}>แก้ไขรายการ</Text>
                        <View className="mb-1">
                            <CustomInput
                                label="จำนวนเงิน"
                                placeholder="จำนวนเงิน"
                                keyboardType="numeric"
                                value={selectedTranfer?.amount?.toString() || ""}
                                onChangeText={(text) =>
                                    setSelectedTranfer((prev: any) => ({ ...prev, amount: Number(text) }))
                                }
                            />
                            <View className="flex-row items-center mt-2">
                                <Calendar size={20} color="#4a86e8" />
                                <Text className="text-black font-bold ml-2 ">วันที่</Text>
                            </View>
                            <CustomInput
                                onChangeText={(text) => {
                                    setSelectedTranfer((prev: any) => ({ ...prev, date: text }));
                                }}
                                value={selectedTranfer?.date || ""}
                                placeholder="กรุณากรอกวันที่ (เช่น 2025-04-18)"
                                type="date"
                                className="pl-3 rounded-lg bg-gray-50 border border-gray-200"
                            />
                        </View>
                        <CustomInput
                            label="ผู้ส่ง"
                            placeholder="ผู้ส่ง"
                            value={selectedTranfer?.sender}
                            onChangeText={(text) =>
                                setSelectedTranfer((prev: any) => ({ ...prev, sender: text }))
                            }
                        />
                        <CustomInput
                            label="ผู้รับ"
                            placeholder="ผู้รับ"
                            value={selectedTranfer?.recipient}
                            onChangeText={(text) =>
                                setSelectedTranfer((prev: any) => ({ ...prev, recipient: text }))
                            }
                        />
                        <View className="mt-1">
                            <View className="flex-row items-center">
                                <Tag size={20} color="#4a86e8" />
                                <Text className="text-black font-bold ml-2">
                                    ประเภทรายการ
                                </Text>
                            </View>
                            <ScrollView
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                className="py-1"
                            >
                                {categories.map((category) => (
                                    <TouchableOpacity
                                        key={category.name}
                                        className={`px-4 py-3 mr-3 rounded-xl flex-row items-center ${selectedTranfer?.typeTranfer === category.name
                                            ? "bg-blue-500"
                                            : "bg-gray-100"
                                            }`}
                                        onPress={() =>
                                            setSelectedTranfer((prev: any) => ({
                                                ...prev,
                                                typeTranfer: category.name,
                                            }))
                                        }
                                    >
                                        <Text className="mr-2 text-lg">{category.icon}</Text>
                                        <Text
                                            className={`font-medium ${selectedTranfer?.typeTranfer === category.name
                                                ? "text-white"
                                                : "text-gray-700"
                                                }`}
                                        >
                                            {category.name}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </View>

                        <CustomInput
                            label="รายละเอียด"
                            type="textarea"
                            placeholder="รายละเอียด"
                            value={selectedTranfer?.detail}
                            onChangeText={(text) =>
                                setSelectedTranfer((prev: any) => ({ ...prev, detail: text }))
                            }
                        />
                        <View style={{ flexDirection: "row", marginTop: 16 }} className="gap-2 justify-end w-full">
                            <ButtonMain
                                title="ยกเลิก"
                                btnColor="secondary"
                                className="w-20"
                                onPress={() => closeModal()}
                            />
                            <ButtonMain
                                title="อัปเดต"
                                btnColor="primary"
                                className="w-20"
                                onPress={() => handleUpdateConfirm()}
                            />
                        </View>
                    </View>
                </View>
            </Modal>

            {/* ลบ */}
            <Modal visible={isModalVisibleDelete}
                onRequestClose={closeModalDelete}
                animationType="slide"
                transparent={true}
            >
                <View style={{ flex: 1, justifyContent: "center", backgroundColor: "rgba(0,0,0,0.4)", padding: 30 }}>
                    <View style={{ backgroundColor: "white", padding: 20, borderRadius: 10 }}>
                        <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 10 }}>ยืนยันการลบ</Text>
                        <Text className="text-lg text-red-600">คุณต้องการลบรายการนี้หรือไม่ ?</Text>
                        <Text className="mt-2 text-lg font-bold">จำนวนเงิน : {selectedTranfer?.amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") ?? "0"} ({selectedTranfer?.typeTranfer ?? "-"})</Text>
                        <Text>วันที่ : {selectedTranfer?.date ?? "-"}</Text>
                        <Text>ผู้ส่ง : {selectedTranfer?.sender ?? "ไม่ระบุ"}</Text>
                        <Text>ผู้รับ : {selectedTranfer?.recipient ?? "ไม่ระบุ"}</Text>
                        <Text>รายละเอียด : {selectedTranfer?.detail ?? "-"}</Text>
                        <View style={{ flexDirection: "row", marginTop: 16 }} className="gap-2 justify-end w-full">
                            <ButtonMain
                                title="ยกเลิก"
                                btnColor="secondary"
                                className="w-20"
                                onPress={() => closeModalDelete()}
                            />
                            <ButtonMain
                                title="ลบ"
                                btnColor="danger"
                                className="w-20"
                                onPress={() => handleDeleteConfirm(selectedTranfer?.id)}
                            />
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}
