// import { CustomInput } from "@/app/components/customInput";
// import { CustomSelect } from "@/app/components/customSelect";
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   Alert,
//   StyleSheet,
//   ScrollView,
// } from "react-native";
// import React, { useState } from "react";
// import { router } from "expo-router";
// import { ArrowLeft, House } from "lucide-react-native";
// import axios from "axios";
// import Constants from "expo-constants";
// import { ButtonMain } from "../components/button";
// import HeaderCustom from "../components/header";

// // ประเภทค่าใช้จ่าย
// // const CATEGORIES = {
// //     food: { name: "อาหาร", color: "#FF9500" },
// //     transport: { name: "เดินทาง", color: "#5856D6" },
// //     shopping: { name: "ช้อปปิ้ง", color: "#FF2D55" },
// //     bills: { name: "บิล/ค่างวด", color: "#007AFF" },
// //     entertainment: { name: "บันเทิง", color: "#AF52DE" },
// //     health: { name: "สุขภาพ", color: "#34C759" },
// //     other: { name: "อื่นๆ", color: "#8E8E93" },
// // };

// // const categoryOptions = Object.entries(CATEGORIES).map(([key, value]) => ({
// //     label: value.name,
// //     value: key
// // }));

// export default function AddForm() {
//   const [sender, setSender] = useState("");
//   const [recipient, setRecipient] = useState("");
//   const [date, setDate] = useState("");
//   const [time, setTime] = useState("");
//   const [amount, setAmount] = useState("");
//   //const [category, setCategory] = useState('');
//   const [detail, setDetail] = useState("");
//   const categories = [
//     "ค่าอาหาร",
//     "ค่ายา",
//     "ค่าท่องเที่ยว",
//     "ค่าน้ำค่าไฟ",
//     "อื่นๆ",
//   ];
//   const [typeTranfer, setTypeTranfer] = useState<string>("อื่นๆ");

//   const API_BACKEND = Constants.expoConfig?.extra?.API_BACKEND;
//   const handleAmountChange = (text: string) => {
//     const filtered = text.replace(/[^0-9.]/g, ""); // กรองให้เหลือแค่ตัวเลขกับจุด
//     // ป้องกันการพิมพ์จุดหลายตัว
//     const parts = filtered.split(".");
//     if (parts.length > 2) {
//       return;
//     }
//     setAmount(filtered);
//   };

//   const displayDate = (isoDate: string) => {
//     if (!isoDate) return ""; // หากไม่มีค่า (null หรือ undefined) ให้แสดงค่าว่าง

//     const date = new Date(isoDate);

//     if (isNaN(date.getTime())) return ""; // หากวันที่ไม่สามารถแปลงได้ (NaN) ให้แสดงค่าว่าง

//     const day = date.getDate().toString().padStart(2, '0');
//     const month = (date.getMonth() + 1).toString().padStart(2, '0');
//     const year = (date.getFullYear() + 543).toString(); // แปลงเป็น พ.ศ.

//     return `${day}/${month}/${year}`;
//   };

//   const saveToDatabase = async () => {
//     // if (sender == "" || recipient == "" || amount == "") {
//     //   Alert.alert("ข้อผิดพลาด", "กรุณากรอกข้อมูลผู้โอนและผู้รับ และจํานวนเงิน");
//     //   return;
//     // }
//     try {
//       const reaponse = await axios.post(API_BACKEND + "/tranfers", {
//         sender: "เงินสด",
//         recipient: "",
//         amount: parseFloat(amount),
//         date: date,
//         time: "",
//         slip_ref: "",
//         detail: detail,
//         typeTranfer: typeTranfer,
//       });
//       setSender("");
//       setRecipient("");
//       setAmount("");
//       setDate("");
//       setTime("");
//       setTypeTranfer("");
//       setDetail("");

//       Alert.alert("บันทึกสําเร็จ", "ข้อมูลถูกบันทึกแล้ว");
//     } catch (error) {
//       console.error("เกิดข้อผิดพลาดในการบันทึก:", error);
//       Alert.alert("บันทึกไม่สำเร็จ", "เกิดข้อผิดพลาดในการบันทึกข้อมูล");
//     }
//   };

//   const backtoHome = () => {
//     router.push("/");
//   };

//   return (
//     <>
//       <HeaderCustom title="บันทึกการโอนเงิน" />
//       <View style={styles.resultBox}>
//         <Text style={styles.resultTitle}>ข้อมูลการทำรายการ</Text>
//         {/* <View style={styles.resultRow}>
//                     <Text style={styles.resultLabel}>ผู้โอน:</Text>
//                     <CustomInput
//                         onChangeText={setSender}
//                         value={sender}
//                         className="w-2/3"
//                         placeholder="กรุณากรอกผู้โอน"
//                     />
//                 </View> */}

//         {/* <View style={styles.resultRow}>
//                     <Text style={styles.resultLabel}>ผู้รับ:</Text>
//                     <CustomInput
//                         onChangeText={setRecipient}
//                         value={recipient}
//                         className="w-2/3"
//                         placeholder="กรุณากรอกผู้รับ"
//                     />
//                 </View> */}

//         <View style={styles.resultRow}>
//           <Text style={styles.resultLabel}>วันที่:</Text>
//           <CustomInput
//             onChangeText={setDate}
//             value={displayDate(date)} // แสดงในรูปแบบ dd/mm/yyyy
//             placeholder="กรุณากรอกวันที่"
//             type="date"
//             className="w-2/3"
//           />
//         </View>

//         {/* <View style={styles.resultRow}>
//                     <Text style={styles.resultLabel}>เวลา:</Text>
//                     <CustomInput
//                         onChangeText={setTime}
//                         value={time}
//                         className="w-2/3"
//                         placeholder="กรุณากรอกเวลา"
//                     />
//                 </View> */}

//         <View style={styles.resultRow}>
//           <Text style={styles.resultLabel}>จำนวนเงิน:</Text>
//           <CustomInput
//             value={amount}
//             onChangeText={handleAmountChange}
//             placeholder="กรุณากรอกจำนวนเงิน"
//             type="number"
//             className="w-2/3"
//           />
//         </View>

//         <View style={styles.resultRow}>
//           <Text style={styles.resultLabel}>ประเภท:</Text>
//           <ScrollView horizontal showsHorizontalScrollIndicator={false}>
//             {categories.map((category) => (
//               <TouchableOpacity
//                 key={category}
//                 className={`px-4 py-2 mr-2 rounded-full ${
//                   typeTranfer === category ? "bg-blue-500" : "bg-gray-300"
//                 }`}
//                 onPress={() => setTypeTranfer(category)}
//               >
//                 <Text
//                   className={`${
//                     typeTranfer === category ? "text-white" : "text-black"
//                   }`}
//                 >
//                   {category}
//                 </Text>
//               </TouchableOpacity>
//             ))}
//           </ScrollView>
//         </View>

//         <View style={styles.resultRow}>
//           <Text style={styles.resultLabel}>รายละเอียด:</Text>
//           <CustomInput
//             type="textarea"
//             onChangeText={setDetail}
//             value={detail}
//             className="w-2/3"
//             placeholder="กรุณากรอกรายละเอียด"
//           />
//         </View>

//         <ButtonMain
//           title="เพิ่มข้อมูล"
//           btnColor="submit"
//           onPress={saveToDatabase}
//         />
//       </View>
//     </>
//   );
// }

// const styles = StyleSheet.create({
//   // ... ใช้ style จากที่คุณมีอยู่แล้ว ...
//   resultBox: {
//     marginTop: 10,
//     margin: 10,
//     backgroundColor: "#fff",
//     padding: 15,
//     borderRadius: 12,
//     borderWidth: 1,
//     borderColor: "#e0e0e0",
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.1,
//     shadowRadius: 2,
//     elevation: 2,
//   },
//   resultTitle: {
//     fontSize: 18,
//     fontWeight: "bold",
//     marginBottom: 15,
//     color: "#333",
//     textAlign: "center",
//   },
//   resultRow: {
//     flexDirection: "row",
//     marginBottom: 10,
//     alignItems: "center",
//   },
//   resultLabel: {
//     fontWeight: "bold",
//     width: 100,
//     color: "#555",
//   },
//   leftIcon: {
//     width: 40, // ความกว้างพอๆ กับพื้นที่ของ rightPlaceholder
//     alignItems: "flex-start",
//     left: 15,
//   },
//   rightPlaceholder: {
//     width: 40, // ต้องเท่ากับ leftIcon เพื่อบาลานซ์
//   },

//   header: {
//     flexDirection: "row",
//     alignItems: "center",
//     paddingTop: 50,
//     paddingBottom: 15,
//     backgroundColor: "#4a86e8",

//     // justifyContent: "center",
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.2,
//     shadowRadius: 2,
//     elevation: 3,
//     justifyContent: "space-between", // ให้ซ้าย-กลาง-ขวาแบ่งเท่าๆ กัน
//   },
//   title: {
//     fontSize: 22,
//     fontWeight: "bold",
//     color: "#fff",
//     textAlign: "center",
//   },
// });

import { CustomInput } from "@/app/components/customInput";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ScrollView,
} from "react-native";
import React, { useState } from "react";
import { router } from "expo-router";
import {
  ArrowLeft,
  Plus,
  DollarSign,
  Calendar,
  Clock,
  Tag,
  FileText,
} from "lucide-react-native";
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

            <TouchableOpacity
              onPress={saveToDatabase}
              className="flex-row items-center bg-blue-500 px-4 h-10 rounded-xl shadow-sm"
            >
              <Plus size={20} color="#ffffff" />
              <Text className="text-white font-semibold text-base ml-2">
                บันทึกรายการ
              </Text>
            </TouchableOpacity>
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
                  className={`px-4 py-3 mr-3 rounded-xl flex-row items-center ${
                    typeTranfer === category.name
                      ? "bg-blue-500"
                      : "bg-gray-100"
                  }`}
                  onPress={() => setTypeTranfer(category.name)}
                >
                  <Text className="mr-2 text-lg">{category.icon}</Text>
                  <Text
                    className={`font-medium ${
                      typeTranfer === category.name
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
        </View>

        {/* <TouchableOpacity
          onPress={saveToDatabase}
          className="bg-blue-500 py-4 rounded-xl flex-row justify-center items-center mb-6 shadow-sm"
        >
          <Plus size={22} color="#ffffff" />
          <Text className="text-white font-bold text-lg ml-2">
            บันทึกรายการ
          </Text>
        </TouchableOpacity> */}
      </ScrollView>
    </View>
  );
}
