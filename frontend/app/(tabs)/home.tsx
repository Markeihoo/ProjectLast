import { ButtonMain } from "@/app/components/button";
import { View, Text } from "react-native";

export default function Home() {
  return (
    <View>
      <Text className="text-2xl mt-12">test tailwind</Text>
      <ButtonMain
        title="test"
        btnColor="primary"
        onPress={() => console.log("test")}
      />
    </View>
  );
}