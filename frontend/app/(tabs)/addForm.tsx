import { CustomInput } from "@/app/components/customInput";
import { CustomSelect } from "@/app/components/customSelect";
import { View, Text, TouchableOpacity, Alert, StyleSheet } from "react-native";
import React, { useState } from "react";
import { router } from "expo-router";
import { ArrowLeft, House } from "lucide-react-native";
import axios from "axios";
import Constants from 'expo-constants';
import { ButtonMain } from "../components/button";
import HeaderCustom from "../components/header";

// ประเภทค่าใช้จ่าย
const CATEGORIES = {
    food: { name: "อาหาร", color: "#FF9500" },
    transport: { name: "เดินทาง", color: "#5856D6" },
    shopping: { name: "ช้อปปิ้ง", color: "#FF2D55" },
    bills: { name: "บิล/ค่างวด", color: "#007AFF" },
    entertainment: { name: "บันเทิง", color: "#AF52DE" },
    health: { name: "สุขภาพ", color: "#34C759" },
    other: { name: "อื่นๆ", color: "#8E8E93" },
};

const categoryOptions = Object.entries(CATEGORIES).map(([key, value]) => ({
    label: value.name,
    value: key
}));

export default function AddForm() {
    const [sender, setSender] = useState('');
    const [recipient, setRecipient] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('');
    const [detail, setDetail] = useState('');

    const API_BACKEND = Constants.expoConfig?.extra?.API_BACKEND;

    const saveToDatabase = async () => {
        if (sender == '' || recipient == '' || amount == '') {
            Alert.alert(
                "ข้อผิดพลาด",
                "กรุณากรอกข้อมูลผู้โอนและผู้รับ และจํานวนเงิน"
            );
            return;
        }
        try {

            const reaponse = await axios.post(API_BACKEND + "/tranfers", {
                sender: sender,
                recipient: recipient,
                amount: parseFloat(
                    amount
                ),
                date: date,
                time: time,
                slip_ref: '',
                detail: detail,
                typeTranfer: category
            });
            setSender('');
            setRecipient('');
            setAmount('');
            setDate('');
            setTime('');
            setCategory('');
            setDetail('');

            Alert.alert("บันทึกสําเร็จ", "ข้อมูลถูกบันทึกแล้ว");
        } catch (error) {
            console.error('เกิดข้อผิดพลาดในการบันทึก:', error);
            Alert.alert(
                "บันทึกไม่สำเร็จ",
                "เกิดข้อผิดพลาดในการบันทึกข้อมูล"
            );
        }
    };

    const backtoHome = () => {
        router.push('/');
    };

    return (
        <>
            <HeaderCustom title="บันทึกการโอนเงิน" />
            <View style={styles.resultBox} >
                <Text style={styles.resultTitle}>ข้อมูลการทำรายการ</Text>
                <View style={styles.resultRow}>
                    <Text style={styles.resultLabel}>ผู้โอน:</Text>
                    <CustomInput
                        onChangeText={setSender}
                        value={sender}
                        className="w-2/3"
                        placeholder="กรุณากรอกผู้โอน"
                    />
                </View>

                <View style={styles.resultRow}>
                    <Text style={styles.resultLabel}>ผู้รับ:</Text>
                    <CustomInput
                        onChangeText={setRecipient}
                        value={recipient}
                        className="w-2/3"
                        placeholder="กรุณากรอกผู้รับ"
                    />
                </View>

                <View style={styles.resultRow}>
                    <Text style={styles.resultLabel}>วันที่:</Text>
                    <CustomInput
                        onChangeText={setDate}
                        value={date}
                        className="w-2/3"
                        placeholder="กรุณากรอกวันที่"
                    />
                </View>

                <View style={styles.resultRow}>
                    <Text style={styles.resultLabel}>เวลา:</Text>
                    <CustomInput
                        onChangeText={setTime}
                        value={time}
                        className="w-2/3"
                        placeholder="กรุณากรอกเวลา"
                    />
                </View>

                <View style={styles.resultRow}>
                    <Text style={styles.resultLabel}>จำนวนเงิน:</Text>
                    <CustomInput
                        onChangeText={setAmount}
                        value={amount}
                        className="w-2/3"
                        placeholder="กรุณากรอกจํานวนเงิน"
                    // keyboardType="numeric"
                    />
                </View>

                <View style={styles.resultRow}>
                    <Text style={styles.resultLabel}>ประเภท:</Text>
                    <CustomSelect
                        value={category}
                        onChangeText={setCategory}
                        options={categoryOptions}
                        placeholder="เลือกประเภทค่าใช้จ่าย"
                    />
                </View>

                <View style={styles.resultRow}>
                    <Text style={styles.resultLabel}>รายละเอียด:</Text>
                    <CustomInput
                        type="textarea"
                        onChangeText={setDetail}
                        value={detail}
                        className="w-2/3"
                        placeholder="กรุณากรอกรายละเอียด"
                    />
                </View>

                <ButtonMain
                    title="เพิ่มข้อมูล"
                    btnColor="submit"
                    onPress={saveToDatabase}
                />
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    // ... ใช้ style จากที่คุณมีอยู่แล้ว ...
    resultBox: {
        marginTop: 10,
        margin: 10,
        backgroundColor: "#fff",
        padding: 15,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#e0e0e0",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    resultTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 15,
        color: "#333",
        textAlign: "center",
    },
    resultRow: {
        flexDirection: "row",
        marginBottom: 10,
        alignItems: "center",
    },
    resultLabel: {
        fontWeight: "bold",
        width: 100,
        color: "#555",
    },
    leftIcon: {
        width: 40, // ความกว้างพอๆ กับพื้นที่ของ rightPlaceholder
        alignItems: "flex-start",
        left: 15,

    },
    rightPlaceholder: {
        width: 40, // ต้องเท่ากับ leftIcon เพื่อบาลานซ์
    },

    header: {
        flexDirection: "row",
        alignItems: "center",
        paddingTop: 50,
        paddingBottom: 15,
        backgroundColor: "#4a86e8",

        // justifyContent: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 3,
        justifyContent: "space-between", // ให้ซ้าย-กลาง-ขวาแบ่งเท่าๆ กัน
    },
    title: {
        fontSize: 22,
        fontWeight: "bold",
        color: "#fff",
        textAlign: "center",
    },
});
