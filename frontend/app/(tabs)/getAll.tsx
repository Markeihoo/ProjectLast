import { View, Text, Modal, TextInput, ScrollView, Button, Alert, ActivityIndicator } from "react-native";
import HeaderCustom from "@/app/components/header";
import { ItemCardMain } from "@/app/components/itemCard";
import PaginationCustom from "@/app/components/pagination";
import React, { useState, useCallback } from "react";
import { ButtonMain } from "../components/button";
import { router } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import axios from "axios";
import Constants from "expo-constants";

const API_BACKEND = Constants.expoConfig?.extra?.API_BACKEND;

export default function GetAll() {
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [tranfers, setTranfers] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedTranfer, setSelectedTranfer] = useState<any>(null);
    const [dataCount, setDataCount] = useState(0);
    useFocusEffect(
        useCallback(() => {
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
            fetchData();
        }, [page])
    );

    const handlePrev = () => {
        if (page > 1) setPage((prev) => prev - 1);
    };

    const handleNext = () => {
        if (page < totalPages) setPage((prev) => prev + 1);
    };

    const handleDelete = (id: string) => {
        Alert.alert(
            "ยืนยันการลบ",
            "คุณแน่ใจหรือไม่ว่าต้องการลบรายการนี้?",
            [
                {
                    text: "ยกเลิก",
                    style: "cancel"
                },
                {
                    text: "ยืนยัน",
                    onPress: () => {
                        axios
                            .delete(`${API_BACKEND}/tranfers/${id}`)
                            .then(() => {
                                setTranfers((prev) => prev.filter((t) => t.id !== id));
                                alert("ลบรายการเรียบร้อยแล้ว");
                            })
                            .catch((error) =>
                                console.error("Error deleting tranfer:", error)
                            );
                    },
                    style: "destructive"
                }
            ]
        );
    };

    const handleEdit = (tranfer: any) => {
        setSelectedTranfer(tranfer);
        setIsModalVisible(true);
    };

    const closeModal = () => {
        setSelectedTranfer(null);
        setIsModalVisible(false);
    };

    const handleUpdate = () => {
        if (selectedTranfer?.id) {
            axios
                .put(`${API_BACKEND}/tranfers/${selectedTranfer.id}`, selectedTranfer)
                .then(() => {
                    closeModal();
                    setTranfers((prev) =>
                        prev.map((t) => (t.id === selectedTranfer.id ? selectedTranfer : t))
                    );
                })
                .catch((error) => {
                    console.error("Error updating tranfer:", error);
                });
        }
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
                <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 30 }}>
                    <ButtonMain
                        title="เพิ่มรายการใหม่"
                        btnSize="full"
                        className="mb-4"
                        onPress={() => router.push("/new")}
                    />

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
                            titleBtn="ลบ"
                            btnColor="danger"
                            onDelete={() => handleDelete(item.id)}
                            onEdit={() => handleEdit(item)}
                        />
                    ))}
                </ScrollView>
            )}

            <PaginationCustom
                page={page}
                totalPages={totalPages}
                handlePrev={handlePrev}
                handleNext={handleNext}
            />

            {/* Modal สำหรับแก้ไขข้อมูล */}
            <Modal visible={isModalVisible} onRequestClose={closeModal} animationType="slide" transparent>
                <View style={{ flex: 1, justifyContent: "center", backgroundColor: "rgba(0,0,0,0.4)", padding: 16 }}>
                    <View style={{ backgroundColor: "white", padding: 20, borderRadius: 10 }}>
                        <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>แก้ไขรายการ</Text>

                        <TextInput
                            placeholder="จำนวนเงิน"
                            keyboardType="numeric"
                            value={selectedTranfer?.amount?.toString()}
                            onChangeText={(text) =>
                                setSelectedTranfer((prev: any) => ({ ...prev, amount: Number(text) }))
                            }
                        />

                        <TextInput
                            placeholder="ผู้ส่ง"
                            value={selectedTranfer?.sender}
                            onChangeText={(text) =>
                                setSelectedTranfer((prev: any) => ({ ...prev, sender: text }))
                            }
                        />

                        <TextInput
                            placeholder="ผู้รับ"
                            value={selectedTranfer?.recipient}
                            onChangeText={(text) =>
                                setSelectedTranfer((prev: any) => ({ ...prev, recipient: text }))
                            }
                        />

                        <TextInput
                            placeholder="รายละเอียด"
                            value={selectedTranfer?.detail}
                            onChangeText={(text) =>
                                setSelectedTranfer((prev: any) => ({ ...prev, detail: text }))
                            }
                        />

                        <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 16 }}>
                            <Button title="บันทึก" onPress={handleUpdate} />
                            <Button title="ยกเลิก" onPress={closeModal} color="red" />
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}
