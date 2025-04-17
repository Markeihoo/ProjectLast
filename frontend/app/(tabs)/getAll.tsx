import { View, Text, Modal, TextInput, ScrollView, Button, Alert, ActivityIndicator, TouchableOpacity } from "react-native";
import HeaderCustom from "@/app/components/header";
import ItemCardMain from "@/app/components/itemCard";
import PaginationCustom from "@/app/components/pagination";
import React, { useState, useCallback } from "react";
import { ButtonMain } from "../components/button";
import { router } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import axios from "axios";
import Constants from "expo-constants";
import { CustomInput } from "@/app/components/customInput";
import {
    ArrowLeft,
    Plus,
    DollarSign,
    Calendar,
    Clock,
    Tag,
    FileText,

} from "lucide-react-native";
const API_BACKEND = Constants.expoConfig?.extra?.API_BACKEND;

export default function GetAll() {
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [tranfers, setTranfers] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isModalVisibleDelete, setIsModalVisibleDelete] = useState(false);
    const [selectedTranfer, setSelectedTranfer] = useState<any>(null);
    const [dataCount, setDataCount] = useState(0);
    const categories = [
        { name: "ค่าอาหาร", icon: "🍲", color: "#FF9500" },
        { name: "ค่ายา", icon: "💊", color: "#34C759" },
        { name: "ค่าท่องเที่ยว", icon: "🏖️", color: "#5856D6" },
        { name: "ค่าน้ำค่าไฟ", icon: "💡", color: "#007AFF" },
        { name: "อื่นๆ", icon: "📋", color: "#8E8E93" },
    ];
    const [typeTranfer, setTypeTranfer] = useState("อื่นๆ");

    const fetchData = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get(
                `${API_BACKEND}/tranfersAllWithPagination?page=${page}`
            );
            setTranfers(response.data.data);
            setTotalPages(response.data.pagination.totalPages);
            setDataCount(response.data.pagination.totalItems);
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchData();
        }, [page])
    );

    const handlePrev = () => {
        if (page > 1) setPage((prev) => prev - 1);
    };

    const handleNext = () => {
        if (page < totalPages) setPage((prev) => prev + 1);
    };

    const handleDeleteConfirm = (id: string) => {
        try {
            axios.delete(`${API_BACKEND}/tranfers/${id}`).then(() => {
                setTranfers((prev) => prev.filter((t) => t.id !== id));
                setIsModalVisibleDelete(false);
                fetchData();
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
                fetchData();
            })
            .catch((error) => {
                console.error("Error updating tranfer:", error);
            });
    };

    return (
        <View style={{ flex: 1 }}>
            <HeaderCustom title={`รายการทั้งหมด \n ${dataCount} รายการ`} />
            {isLoading ? (
                <View style={{ flex: 1, justifyContent: "center", alignItems: "center", paddingTop: 50 }}>
                    <ActivityIndicator size="large" color="#007AFF" />
                    <Text className="font-bold mt-2">กำลังโหลดข้อมูล...</Text>
                </View>
            ) : (
                <>
                    <ButtonMain
                        title="เพิ่มรายการใหม่"
                        btnSize="full"
                        className="mb-4"
                        onPress={() => router.push("/new")}
                    />
                    <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 30 }}>
                        {tranfers.map((item) => (
                            <ItemCardMain
                                key={item.id}
                                amount={item.amount}
                                typeTranfer={item.typeTranfer}
                                date={item.date}
                                time={item.time || "-"}
                                sender={item.sender}
                                recipient={item.recipient}
                                detail={item.detail}
                                onDelete={() => handleDelete(item)}
                                onEdit={() => handleEdit(item)}
                            />
                        ))}
                    </ScrollView>
                </>
            )}

            <PaginationCustom
                page={page}
                totalPages={totalPages}
                handlePrev={handlePrev}
                handleNext={handleNext}
            />

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
                                btnColor="danger"
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
