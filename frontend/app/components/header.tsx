import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { router } from "expo-router";
import { House } from "lucide-react-native";

interface Props {
    title: string;
}

export default function HeaderCustom({ title }: Props) {
    const backtoHome = () => {
        router.push('/');
    };

    return (
        <View style={styles.header}>
            <TouchableOpacity style={styles.leftIcon} onPress={backtoHome}>
                <View className="flex-row">
                    <House size={24} color="#fff" />
                </View>
            </TouchableOpacity>
            <Text style={styles.title}>{title}</Text>
            <View style={styles.rightPlaceholder} />
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: "row",
        alignItems: "center",
        paddingTop: 50,
        paddingBottom: 15,
        backgroundColor: "#4a86e8",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 3,
        justifyContent: "space-between",
        paddingHorizontal: 10,
    },
    title: {
        fontSize: 22,
        fontWeight: "bold",
        color: "#fff",
        textAlign: "center",
    },
    leftIcon: {
        width: 40,
        alignItems: "flex-start",
    },
    rightPlaceholder: {
        width: 40,
    },
});
