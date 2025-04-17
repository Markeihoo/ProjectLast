import { View, Text } from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { ButtonMain } from "@/app/components/button";

export default function Home() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-white relative">
      <View className="absolute top-0 left-0 right-0">
        <LinearGradient
          colors={["#1E3A8A", "#3B82F6"]}
          style={{
            height: 350,
            borderBottomLeftRadius: 120,
            borderBottomRightRadius: 120,
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: 24,
            paddingTop: 200,
            paddingBottom: 50,
          }}
        >
          <Text
            className="text-white font-bold text-center"
            style={{ fontSize: 46, lineHeight: 52 }}
          >
            บันทึกรายจ่าย
          </Text>
          <Text
            className="text-white text-center mt-2"
            style={{ fontSize: 26, fontWeight: "600" }}
          >
            ด้วยสลิปโอนเงิน
          </Text>
        </LinearGradient>
      </View>
      <View className="flex-1 items-center justify-center px-6 mt-8">
        <View className="w-full space-y-5">
          <ButtonMain
            title="รายการทั้งหมด"
            btnSize="menu"
            arrow={true}
            onPress={() => router.push("/getAll")}
          />
          <ButtonMain
            title="เพิ่มรายการใหม่"
            btnSize="menu"
            arrow={true}
            onPress={() => router.push("/new")}
          />
          <ButtonMain
            title="รายงานการใช้จ่าย"
            btnSize="menu"
            arrow={true}
            onPress={() => router.push("/report")}
          />
        </View>
      </View>
    </View>
  );
}
