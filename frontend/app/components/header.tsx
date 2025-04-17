import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { router } from "expo-router";
import { ArrowBigLeft, ArrowLeft, House, Plus } from "lucide-react-native";

interface Props {
    title: string;
}

export default function HeaderCustom({ title }: Props) {
    const backtoHome = () => {
        router.push('/');
    };
    const backtonew = () => {
        router.push('/new');
    };
    const back = () => {
        router.back();
    }

    return (
        <View style={styles.header}>
            <View className="flex-row space-x-8">
                <TouchableOpacity onPress={backtoHome}>
                    <House size={24} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity onPress={back}>
                    <ArrowLeft size={24} color="#fff" style={{ marginLeft: 10 }} />
                </TouchableOpacity>
            </View>
            <Text style={styles.title} className="ml-[-10px]">{title}</Text>

            <TouchableOpacity style={styles.leftIcon} onPress={backtonew}>
                <View className="flex-row">
                    <Plus size={24} color="#fff" />
                </View>
            </TouchableOpacity>
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
