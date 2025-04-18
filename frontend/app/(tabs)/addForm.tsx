import { CustomInput } from "@/app/components/customInput";
import {
    View, Text, TouchableOpacity, Alert, StyleSheet, ScrollView,
} from "react-native";
import React, { useState } from "react";
import { router } from "expo-router";
import { ArrowLeft, Plus, DollarSign, Calendar, Clock, Tag, FileText, } from "lucide-react-native";
import axios from "axios";
import Constants from "expo-constants";
import { ButtonMain } from "../components/button";
import HeaderCustom from "../components/header";

export default function AddForm() {
    const [date, setDate] = useState("");
    const [amount, setAmount] = useState("");
    const [detail, setDetail] = useState("");
    const categories = [
        { name: "ค่าอาหาร", icon: "🍲", color: "#FF9500" },
        { name: "ค่ายา", icon: "💊", color: "#34C759" },
        { name: "ค่าท่องเที่ยว", icon: "🏖️", color: "#5856D6" },
        { name: "ค่าน้ำค่าไฟ", icon: "💡", color: "#007AFF" },
        { name: "อื่นๆ", icon: "📋", color: "#8E8E93" },
    ];
    const [typeTranfer, setTypeTranfer] = useState("อื่นๆ");

    const API_BACKEND = Constants.expoConfig?.extra?.API_BACKEND;

    const handleAmountChange = (text: string) => {
        const filtered = text.replace(/[^0-9.]/g, "");
        const parts = filtered.split(".");
        if (parts.length > 2) {
            return;
        }
        setAmount(filtered);
    };

    const displayDate = (isoDate: string) => {
        if (!isoDate) return "";
        const date = new Date(isoDate);
        if (isNaN(date.getTime())) return "";
        const day = date.getDate().toString().padStart(2, "0");
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const year = (date.getFullYear() + 543).toString();
        return `${day}/${month}/${year}`;
    };

    const saveToDatabase = async () => {
        if (!amount || !typeTranfer) {
            Alert.alert(
                "ข้อมูลไม่ครบถ้วน",
                "กรุณากรอกจำนวนเงิน วันที่ และเลือกประเภทรายการ"
            );
            return;
        }
        if (!date) {
            setDate(new Date().toISOString());
        }

        try {
            const response = await axios.post(API_BACKEND + "/tranfers", {
                sender: "เงินสด",
                recipient: "",
                amount: parseFloat(amount),
                date: date || new Date().toISOString().split("T")[0],
                time: "",
                slip_ref: "",
                detail: detail,
                typeTranfer: typeTranfer,
            });

            setAmount("");
            setDate("");
            setTypeTranfer("อื่นๆ");
            setDetail("");

            Alert.alert("บันทึกสำเร็จ", "รายการของคุณถูกบันทึกเรียบร้อยแล้ว");
            router.push("/getAll");
        } catch (error) {
            console.error("เกิดข้อผิดพลาดในการบันทึก:", error);
            Alert.alert(
                "บันทึกไม่สำเร็จ",
                "เกิดข้อผิดพลาดในการบันทึกข้อมูล กรุณาลองใหม่อีกครั้ง"
            );
        }
    };

    return (
        <View className="flex-1 bg-gray-50">
            <HeaderCustom title="บันทึกรายจ่าย" />

            <ScrollView className="flex-1 px-4 pt-4 pb-6">
                <View className="bg-white rounded-xl shadow-sm p-5 mb-6">
                    <View className="mb-6 flex-row justify-between items-center">
                        <Text className="text-xl font-bold text-gray-800">
                            ข้อมูลรายการ
                        </Text>
                    </View>

                    {/* จำนวนเงิน */}
                    <View className="mb-5">
                        <View className="flex-row items-center mb-2">
                            <DollarSign size={20} color="#4a86e8" />
                            <Text className="text-gray-700 font-medium ml-2">จำนวนเงิน</Text>
                        </View>
                        <View className="relative">
                            <CustomInput
                                value={amount}
                                onChangeText={handleAmountChange}
                                placeholder="กรุณากรอกจำนวนเงิน"
                                type="number"
                                className="pl-3 h-12 rounded-lg bg-gray-50 border border-gray-200 text-lg"
                            />
                            <Text className="absolute right-4 top-3 text-gray-500">บาท</Text>
                        </View>
                    </View>

                    {/* วันที่ */}
                    <View className="mb-5">
                        <View className="flex-row items-center mb-2">
                            <Calendar size={20} color="#4a86e8" />
                            <Text className="text-gray-700 font-medium ml-2">วันที่</Text>
                            <Text className="text-gray-500 ml-2 text-xs">(ถ้าไม่กรอกจะใช้วันที่ปัจจุบัน)</Text>
                        </View>
                        <CustomInput
                            onChangeText={setDate}
                            value={displayDate(date)}
                            placeholder="กรุณากรอกวันที่"
                            type="date"
                            className="pl-3 h-12 rounded-lg bg-gray-50 border border-gray-200"
                        />
                    </View>

                    {/* ประเภทรายการ */}
                    <View className="mb-5">
                        <View className="flex-row items-center mb-3">
                            <Tag size={20} color="#4a86e8" />
                            <Text className="text-gray-700 font-medium ml-2">
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
                                    className={`px-4 py-3 mr-3 rounded-xl flex-row items-center ${typeTranfer === category.name
                                        ? "bg-blue-500"
                                        : "bg-gray-100"
                                        }`}
                                    onPress={() => setTypeTranfer(category.name)}
                                >
                                    <Text className="mr-2 text-lg">{category.icon}</Text>
                                    <Text
                                        className={`font-medium ${typeTranfer === category.name
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

                    {/* รายละเอียด */}
                    <View className="mb-6">
                        <View className="flex-row items-center mb-2">
                            <FileText size={20} color="#4a86e8" />
                            <Text className="text-gray-700 font-medium ml-2">
                                รายละเอียด (ถ้ามี)
                            </Text>
                        </View>
                        <CustomInput
                            type="textarea"
                            onChangeText={setDetail}
                            value={detail}
                            placeholder="กรุณากรอกรายละเอียดเพิ่มเติม"
                            className="pl-3 pt-2 pb-2 rounded-lg bg-gray-50 border border-gray-200 h-24"
                        //multiline={true}
                        //numberOfLines={4}
                        />
                    </View>
                    <ButtonMain
                        title="เพิ่มรายการ"
                        btnColor="submit"
                        onPress={() => saveToDatabase()}
                    />
                </View>
            </ScrollView>
        </View>
    );
}
