import React, { useState, useRef, useEffect } from "react";
import { View, Button, Image, Alert, Text, StyleSheet, ActivityIndicator, ScrollView, TouchableOpacity, Dimensions, FlatList, } from "react-native";
import { ButtonMain } from "@/app/components/button";
import * as ImagePicker from "expo-image-picker";
import * as MediaLibrary from "expo-media-library";
import axios from "axios";
import { useRouter } from "expo-router";
import Constants from "expo-constants";
import { CustomInput } from "@/app/components/customInput";
import HeaderCustom from "@/app/components/header";

interface TransactionInfo {
  transaction_status?: string;
  date?: string;
  time?: string;
  reference_number?: string;
  sender?: {
    name?: string;
    account_suffix?: string;
  };
  receiver?: {
    name?: string;
    account_suffix?: string;
  };
  amount?: string;
  raw?: string;
  detail?: string;
  typeTranferMap?: string;
}

interface ImageData {
  id: string;
  uri: string;
  base64?: string;
  mimeType?: string;
  result: TransactionInfo | null;
  isAnalyzing: boolean;
  error: string | null;
}

const { width } = Dimensions.get("window");

const App = () => {
  const [imagesData, setImagesData] = useState<ImageData[]>([]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const router = useRouter();
  const API_KEY = Constants.expoConfig?.extra?.API_KEY;
  const API_BACKEND = Constants.expoConfig?.extra?.API_BACKEND;

  const categories = [
    "ค่าอาหาร",
    "ค่ายา",
    "ค่าท่องเที่ยว",
    "ค่าน้ำค่าไฟ",
    "อื่นๆ",
  ];
  const [typeTransferMap, setTypeTransferMap] = useState<{
    [key: string]: string;
  }>({});
  const [detailMap, setDetailMap] = useState<{ [key: string]: string }>({});

  const requestPermissions = async () => {
    const { status: mediaStatus } =
      await MediaLibrary.requestPermissionsAsync();
    const { status: pickerStatus } =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    const granted = mediaStatus === "granted" && pickerStatus === "granted";

    if (!granted) {
      Alert.alert(
        "การอนุญาตจำเป็น",
        "กรุณาอนุญาตให้เข้าถึงคลังภาพเพื่อใช้งานฟีเจอร์นี้"
      );
    }

    return granted;
  };

  const pickImages = async () => {
    if (!(await requestPermissions())) return;

    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        allowsMultipleSelection: true,
        quality: 0.8,
        base64: true,
      });

      if (!result.canceled && result.assets.length > 0) {
        const newImagesData: ImageData[] = result.assets.map((asset) => ({
          id: Date.now() + Math.random().toString(),
          uri: asset.uri,
          base64: asset.base64 || undefined,
          mimeType: asset.mimeType,
          result: null,
          isAnalyzing: false,
          error: null,
        }));

        setImagesData((prev) => [...prev, ...newImagesData]);
        newImagesData.forEach((imageData) => {
          if (imageData.base64 && imageData.mimeType) {
            analyzeImage(imageData.id, imageData.base64, imageData.mimeType);
          }
        });
      }
    } catch (error) {
      console.error("เกิดข้อผิดพลาดขณะเลือกภาพ:", error);
      Alert.alert("ข้อผิดพลาด", "ไม่สามารถเลือกภาพได้");
    }
  };

  const analyzeImage = async (id: string, base64: string, mimeType: string) => {
    setImagesData((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isAnalyzing: true, error: null } : item
      )
    );

    try {
      if (base64.length > 10000000) {
        setImagesData((prev) =>
          prev.map((item) =>
            item.id === id
              ? {
                ...item,
                isAnalyzing: false,
                error:
                  "รูปภาพมีขนาดใหญ่เกินไป กรุณาเลือกรูปที่มีขนาดเล็กกว่า",
              }
              : item
          )
        );
        return;
      }

      // เรียกใช้ Gemini 1.5 Flash API
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `คุณเป็น AI ที่ชำนาญในการอ่านสลิปการโอนเงินจากธนาคารไทย
กรุณาวิเคราะห์ภาพสลิปการโอนเงินนี้และสกัดข้อมูลต่อไปนี้ให้ครบถ้วน:
1. สถานะการทำรายการ (สำเร็จ/ไม่สำเร็จ)
2. วันที่ทำรายการ (เช่น 12/04/2025)
3. เวลาทำรายการ (เช่น 14:30:45)
4. เลขอ้างอิง/หมายเลขอ้างอิง (Reference number)
5. ข้อมูลผู้โอน (ชื่อ, เลขบัญชีย่อ - แสดงเฉพาะตัวเลขสุดท้าย 4 หลัก)
6. ข้อมูลผู้รับ (ชื่อ, เลขบัญชีย่อ - แสดงเฉพาะตัวเลขสุดท้าย 4 หลัก) 
7. จำนวนเงินที่โอน (ตัวเลขและหน่วย เช่น 500.00 บาท)

ให้ผลลัพธ์เป็น JSON format ในรูปแบบต่อไปนี้เท่านั้น โดยไม่ต้องมีข้อความอื่นใดนอกเหนือจาก JSON:
{
  "transaction_status": "สำเร็จ", 
  "date": "12/04/2025",
  "time": "14:30:45", 
  "reference_number": "REF12345678",
  "sender": {
    "name": "ชื่อผู้โอน",
    "account_suffix": "1234"
  },
  "receiver": {
    "name": "ชื่อผู้รับ",
    "account_suffix": "5678"
  },
  "amount": "500.00 บาท"
}

หากไม่พบข้อมูลใด ให้ใส่ค่าเป็น null หรือข้อความว่า "ไม่พบข้อมูล"
ตอบเป็น JSON เท่านั้น ไม่ต้องมีข้อความอื่นใดก่อนหรือหลัง JSON`,
                  },
                  {
                    inlineData: {
                      mimeType: mimeType,
                      data: base64,
                    },
                  },
                ],
              },
            ],
            generationConfig: {
              temperature: 0.1,
              maxOutputTokens: 1024,
            },
          }),
        }
      );

      const data = await res.json();

      // ตรวจสอบข้อผิดพลาดจาก API
      if (data.error) {
        console.error("Gemini API error:", data.error);
        setImagesData((prev) =>
          prev.map((item) =>
            item.id === id
              ? {
                ...item,
                isAnalyzing: false,
                error: `เกิดข้อผิดพลาดจาก AI: ${data.error.message || "ไม่ทราบสาเหตุ"
                  }`,
              }
              : item
          )
        );
        return;
      }

      const message = data?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (message) {
        // ตัดข้อความที่ไม่ใช่ JSON ออก
        let jsonText = message.trim();

        // หา JSON ในข้อความ
        const jsonStart = jsonText.indexOf("{");
        const jsonEnd = jsonText.lastIndexOf("}");

        if (jsonStart !== -1 && jsonEnd !== -1) {
          jsonText = jsonText.substring(jsonStart, jsonEnd + 1);
        }

        try {
          const parsed = JSON.parse(jsonText);
          setImagesData((prev) =>
            prev.map((item) =>
              item.id === id
                ? { ...item, result: parsed, isAnalyzing: false, error: null }
                : item
            )
          );
        } catch (err) {
          console.warn("ไม่สามารถแปลงข้อความเป็น JSON ได้:", jsonText);
          setImagesData((prev) =>
            prev.map((item) =>
              item.id === id
                ? {
                  ...item,
                  result: { raw: jsonText },
                  isAnalyzing: false,
                  error: "AI ไม่สามารถวิเคราะห์ข้อมูลในรูปแบบที่ถูกต้อง",
                }
                : item
            )
          );
        }
      } else {
        setImagesData((prev) =>
          prev.map((item) =>
            item.id === id
              ? {
                ...item,
                isAnalyzing: false,
                error:
                  "AI ไม่สามารถวิเคราะห์ภาพได้ กรุณาลองรูปภาพที่มีความชัดเจนมากขึ้น",
              }
              : item
          )
        );
      }
    } catch (error) {
      console.error("การวิเคราะห์ภาพล้มเหลว:", error);
      setImagesData((prev) =>
        prev.map((item) =>
          item.id === id
            ? {
              ...item,
              isAnalyzing: false,
              error:
                "ไม่สามารถเชื่อมต่อกับ AI ได้ กรุณาตรวจสอบการเชื่อมต่ออินเทอร์เน็ต",
            }
            : item
        )
      );
    }
  };

  const deleteImage = (id: string) => {
    setImagesData((prev) => prev.filter((item) => item.id !== id));
    if (
      imagesData.length > 1 &&
      currentIndex === imagesData.findIndex((img) => img.id === id)
    ) {
      if (currentIndex === imagesData.length - 1) {
        setCurrentIndex(currentIndex - 1);
      }
    }
  };

  const reanalyzeImage = (id: string) => {
    const imageData = imagesData.find((item) => item.id === id);
    if (imageData && imageData.base64 && imageData.mimeType) {
      analyzeImage(id, imageData.base64, imageData.mimeType);
    } else {
      Alert.alert("ข้อผิดพลาด", "ไม่สามารถวิเคราะห์รูปภาพซ้ำได้");
    }
  };
  //  format วันที่ และแปลงปี พ.ศ. เป็น ค.ศ.
  const formatDate = (dateStr: string | undefined): string => {
    if (!dateStr) return "";

    // รูปแบบ DD-MM-YYYY หรือ DD/MM/YYYY
    const formatPattern1 = /^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/;

    // รูปแบบ DD MMM YYYY (เช่น 13 เม.ย. 2568)
    const formatPattern2 = /^(\d{1,2})\s+[^\d]+\s+(\d{4})$/;

    let day, month, year;

    if (formatPattern1.test(dateStr)) {
      const parts = dateStr.split(/[/-]/);
      day = parts[0].padStart(2, '0');
      month = parts[1].padStart(2, '0');
      year = convertBuddhistToChristianYear(parts[2]);
      return `${year}-${month}-${day}`;
    }
    else if (formatPattern2.test(dateStr)) {
      // แปลงเดือนในรูปแบบข้อความภาษาไทย
      const thaiMonths = {
        'ม.ค.': '01', 'ก.พ.': '02', 'มี.ค.': '03', 'เม.ย.': '04',
        'พ.ค.': '05', 'มิ.ย.': '06', 'ก.ค.': '07', 'ส.ค.': '08',
        'ก.ย.': '09', 'ต.ค.': '10', 'พ.ย.': '11', 'ธ.ค.': '12'
      };

      const parts = dateStr.split(/\s+/);
      day = parts[0].padStart(2, '0');

      // ค้นหาเดือนในข้อความ
      let monthText = parts[1];
      month = '01'; // ค่าเริ่มต้น

      // ค้นหาเดือนที่ตรงกับข้อความ
      for (const [thaiMonth, monthNum] of Object.entries(thaiMonths)) {
        if (monthText.includes(thaiMonth)) {
          month = monthNum;
          break;
        }
      }

      year = convertBuddhistToChristianYear(parts[2]);
      return `${year}-${month}-${day}`;
    }
    else {
      // กรณีอื่นๆ ให้ส่งค่าเดิมกลับไป
      return dateStr;
    }
  };

  // ฟังก์ชันแปลงปี พ.ศ. เป็น ค.ศ.
  const convertBuddhistToChristianYear = (yearStr: string): string => {
    const year = parseInt(yearStr, 10);

    // ตรวจสอบว่าเป็นปี พ.ศ. หรือไม่ (มากกว่า 2500)
    if (year > 2500) {
      return (year - 543).toString();
    }

    // ถ้าเป็นปี ค.ศ. อยู่แล้ว ส่งค่าเดิมกลับไป
    return yearStr;
  };

  const saveToDatabase = async (id: string) => {
    const imageData = imagesData.find((item) => item.id === id);
    if (!imageData || !imageData.result) {
      Alert.alert(
        "ข้อผิดพลาด",
        "ไม่มีข้อมูลให้บันทึก กรุณาวิเคราะห์รูปภาพก่อน"
      );
      return;
    }
    try {
      const reaponse = await axios.post(API_BACKEND + "/tranfers", {
        sender: `${imageData.result.sender?.name} (${imageData.result.sender?.account_suffix})`,
        recipient: `${imageData.result.receiver?.name} (${imageData.result.receiver?.account_suffix})`,
        amount: parseFloat(
          (imageData?.result.amount || "0")
            .replace(/[^0-9.]/g, '')
        ),
        date: formatDate(imageData.result.date),
        time: imageData.result.time,
        slip_ref: imageData.result.reference_number,
        detail: detailMap[imageData.id] || "",
        typeTranfer: typeTransferMap[imageData.id],
      });
      deleteImage(id);
      Alert.alert("บันทึกสําเร็จ", "ข้อมูลถูกบันทึกแล้ว");
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการบันทึก:", error);
      Alert.alert("บันทึกไม่สำเร็จ", "เกิดข้อผิดพลาดในการบันทึกข้อมูล");
    }
  };

  const onScroll = (event: any) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / width);
    if (index !== currentIndex) {
      setCurrentIndex(index);
    }
  };

  const handleViewableItemsChanged = ({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  };

  const scrollToIndex = (index: number) => {
    if (flatListRef.current && index >= 0 && index < imagesData.length) {
      flatListRef.current.scrollToIndex({ index, animated: true });
      setCurrentIndex(index);
    }
  };

  const renderTransactionInfo = (imageData: ImageData) => {
    if (imageData.isAnalyzing) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4a86e8" />
          <Text style={styles.loadingText}>กำลังวิเคราะห์ภาพ...</Text>
        </View>
      );
    }

    if (imageData.error) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{imageData.error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => reanalyzeImage(imageData.id)}
          >
            <Text style={styles.retryButtonText}>วิเคราะห์อีกครั้ง</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (!imageData.result) return null;

    // กรณีมีข้อมูลดิบแต่ไม่ใช่ JSON ที่ถูกต้อง
    if (imageData.result.raw) {
      return (
        <View style={styles.resultBox}>
          <Text style={styles.errorText}>ไม่สามารถแปลงข้อมูลเป็น JSON ได้</Text>
          <Text style={styles.rawText}>{imageData.result.raw}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => reanalyzeImage(imageData.id)}
          >
            <Text style={styles.retryButtonText}>วิเคราะห์อีกครั้ง</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View style={styles.resultBox}>
        <Text style={styles.resultTitle}>ข้อมูลการทำรายการ:</Text>

        <View style={styles.resultRow}>
          <Text style={styles.resultLabel}>สถานะ:</Text>
          <Text style={styles.resultValue}>
            {imageData.result.transaction_status || "ไม่พบข้อมูล"}
          </Text>
        </View>
        <View style={styles.resultRow}>
          <Text style={styles.resultLabel}>ผู้โอน:</Text>
          <Text style={styles.resultValue}>
            {imageData.result.sender?.name || "ไม่พบข้อมูล"}
            {imageData.result.sender?.account_suffix
              ? ` (XXXX${imageData.result.sender.account_suffix})`
              : ""}
          </Text>
        </View>

        <View style={styles.resultRow}>
          <Text style={styles.resultLabel}>ผู้รับ:</Text>
          <Text style={styles.resultValue}>
            {imageData.result.receiver?.name || "ไม่พบข้อมูล"}
            {imageData.result.receiver?.account_suffix
              ? ` (XXXX${imageData.result.receiver.account_suffix})`
              : ""}
          </Text>
        </View>

        <View style={styles.resultRow}>
          <Text style={styles.resultLabel}>วันที่:</Text>
          <Text style={styles.resultValue}>
            {imageData.result.date || "ไม่พบข้อมูล"}
          </Text>
        </View>

        <View style={styles.resultRow}>
          <Text style={styles.resultLabel}>เวลา:</Text>
          <Text style={styles.resultValue}>
            {imageData.result.time || "ไม่พบข้อมูล"}
          </Text>
        </View>

        <View style={styles.resultRow}>
          <Text style={styles.resultLabel}>เลขอ้างอิง:</Text>
          <Text style={styles.resultValue}>
            {imageData.result.reference_number || "ไม่พบข้อมูล"}
          </Text>
        </View>

        <View style={styles.resultRow}>
          <Text style={styles.resultLabel}>จำนวนเงิน:</Text>
          <Text style={[styles.resultValue, styles.amountText]}>
            {imageData.result.amount || "ไม่พบข้อมูล"}
          </Text>
        </View>

        <View style={styles.resultRow}>
          <Text style={styles.resultLabel}>ประเภท:</Text>

          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category}
                className={`px-4 py-2 mr-2 rounded-full ${typeTransferMap[imageData.id] === category
                  ? "bg-blue-500"
                  : "bg-gray-300"
                  }`}
                onPress={() =>
                  setTypeTransferMap((prev) => ({
                    ...prev,
                    [imageData.id]: category,
                  }))
                }
              >
                <Text
                  className={`${typeTransferMap[imageData.id] === category
                    ? "text-white"
                    : "text-black"
                    }`}
                >
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.resultRow}>
          <Text style={styles.resultLabel}>รายละเอียด:</Text>
          <CustomInput
            type="textarea"
            onChangeText={(text) =>
              setDetailMap((prev) => ({
                ...prev,
                [imageData.id]: text,
              }))
            }
            value={detailMap[imageData.id] || ""}
            className="w-2/3"
            placeholder="กรุณากรอกรายละเอียด"
          />
        </View>
        <ButtonMain
          title="เพิ่มรายการ"
          btnColor="submit"
          onPress={() => saveToDatabase(imageData.id)}
        />
      </View>
    );
  };

  const renderItem = ({ item, index }: { item: ImageData; index: number }) => {
    return (
      <View style={styles.pageContainer}>
        <View style={styles.imageContainer}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => deleteImage(item.id)}
          >
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
          <Image
            source={{ uri: item.uri }}
            style={styles.image}
            resizeMode="contain"
          />
        </View>
        {renderTransactionInfo(item)}
      </View>
    );
  };

  const renderPagination = () => {
    if (imagesData.length <= 1) return null;

    return (
      <View style={styles.paginationContainer}>
        {imagesData.map((_, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.paginationDot,
              currentIndex === index && styles.paginationDotActive,
            ]}
            onPress={() => scrollToIndex(index)}
          />
        ))}
      </View>
    );
  };

  const backtoHome = () => {
    router.push("/");
  };

  const renderImageCounter = () => {
    if (imagesData.length <= 0) return null;

    return (
      <View style={styles.counterContainer}>
        <Text style={styles.counterText}>
          {currentIndex + 1} / {imagesData.length}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <HeaderCustom title="เพิ่มข้อมูลใหม่" />

      <ScrollView>
        <View style={styles.buttonContainer}>
          <ButtonMain
            title="บันทึกข้อมูลแบบฟอร์ม"
            onPress={() => router.push("/addForm")}
          />
          <ButtonMain title="เลือกรูปภาพสลิปโอนเงิน" onPress={pickImages} />
        </View>

        {imagesData.length > 0 ? (
          <>
            <FlatList
              ref={flatListRef}
              data={imagesData}
              renderItem={renderItem}
              keyExtractor={(item) => item.id}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onScroll={onScroll}
              onViewableItemsChanged={handleViewableItemsChanged}
              viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
              contentContainerStyle={{ paddingBottom: 20 }}
            />
            {renderPagination()}
            {renderImageCounter()}
          </>
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              ยังไม่มีรูปภาพ กรุณาเลือกรูปภาพสลิปโอนเงิน{"\n"}
              หรือกรอกแบบฟอร์ม
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
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
  leftIcon: {
    width: 40, // ความกว้างพอๆ กับพื้นที่ของ rightPlaceholder
    alignItems: "flex-start",
    left: 15,
  },
  rightPlaceholder: {
    width: 40, // ต้องเท่ากับ leftIcon เพื่อบาลานซ์
  },

  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },
  buttonContainer: {
    padding: 15,
  },
  uploadButton: {
    backgroundColor: "#4a86e8",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
    elevation: 2,
  },
  uploadButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  pageContainer: {
    width,
    padding: 15,
  },
  imageContainer: {
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
    position: "relative",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  image: {
    width: "100%",
    height: 300,
    backgroundColor: "#fff",
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 10,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  closeButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  loadingContainer: {
    marginTop: 20,
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  loadingText: {
    marginTop: 10,
    color: "#666",
    fontSize: 16,
  },
  errorContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: "#ffeeee",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ffcccc",
  },
  errorText: {
    color: "#cc0000",
    marginBottom: 10,
  },
  retryButton: {
    backgroundColor: "#ff9999",
    padding: 10,
    borderRadius: 6,
    alignItems: "center",
    marginTop: 10,
  },
  retryButtonText: {
    color: "#cc0000",
    fontWeight: "bold",
  },
  resultBox: {
    marginTop: 20,
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
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    paddingBottom: 8,
  },
  resultLabel: {
    fontWeight: "bold",
    width: 100,
    color: "#555",
  },
  resultValue: {
    flex: 1,
    color: "#333",
  },
  amountText: {
    fontWeight: "bold",
    color: "#0066cc",
    fontSize: 16,
  },
  rawText: {
    fontFamily: "monospace",
    fontSize: 12,
    color: "#666",
    marginTop: 8,
    marginBottom: 10,
  },
  saveButton: {
    backgroundColor: "#4CAF50",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
    elevation: 2,
  },
  saveButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },
  paginationDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#ccc",
    margin: 5,
  },
  paginationDotActive: {
    backgroundColor: "#4a86e8",
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  counterContainer: {
    position: "absolute",
    top: 145,
    left: 30,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  counterText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    color: "#888",
    fontSize: 16,
    textAlign: "center",
  },
});
