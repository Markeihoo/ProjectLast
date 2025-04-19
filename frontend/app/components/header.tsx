// import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
// import { router } from "expo-router";
// import { ArrowBigLeft, ArrowLeft, House, Plus } from "lucide-react-native";
// import { useRouter, usePathname } from "expo-router";

// interface Props {
//     title: string;
// }

// export default function HeaderCustom({ title }: Props) {
//     const pathname = usePathname();

//     const backtoHome = () => {
//         router.push('/home');
//     };
//     const backtonew = () => {
//         router.push('/new');
//     };
//     const back = () => {
//         router.back();
//     }

//     return (
//         <View style={styles.header}>
//             <View className="flex-row space-x-8">
//                 <TouchableOpacity onPress={backtoHome}>
//                     <House size={24} color="#fff" />
//                 </TouchableOpacity>
//                 {pathname !== "/" && (
//                     <TouchableOpacity onPress={back}>
//                         <ArrowLeft size={24} color="#fff" style={{ marginLeft: 10 }} />
//                     </TouchableOpacity>
//                 )}

//             </View>
//             <Text style={styles.title} className="ml-[-10px]">{title}</Text>

//             <TouchableOpacity style={styles.leftIcon} onPress={backtonew}>
//                 <View className="flex-row">
//                     <Plus size={24} color="#fff" />
//                 </View>
//             </TouchableOpacity>
//         </View>
//     );
// }


// const styles = StyleSheet.create({
//     header: {
//         flexDirection: "row",
//         alignItems: "center",
//         paddingTop: 50,
//         paddingBottom: 15,
//         backgroundColor: "#4a86e8",
//         shadowColor: "#000",
//         shadowOffset: { width: 0, height: 2 },
//         shadowOpacity: 0.2,
//         shadowRadius: 2,
//         elevation: 3,
//         justifyContent: "space-between",
//         paddingHorizontal: 10,
//     },
//     title: {
//         fontSize: 22,
//         fontWeight: "bold",
//         color: "#fff",
//         textAlign: "center",
//     },
//     leftIcon: {
//         width: 40,
//         alignItems: "flex-start",
//     },
//     rightPlaceholder: {
//         width: 40,
//     },
// });


import { View, Text, TouchableOpacity, SafeAreaView } from "react-native";
import { router, usePathname } from "expo-router";
import { ArrowLeft, House, Plus, AlignJustify } from "lucide-react-native";

interface Props {
    title: string;
}

export default function HeaderCustom({ title }: Props) {
    const pathname = usePathname();

    const backtoHome = () => {
        router.push('/');
    };
    const backtonew = () => {
        router.push('/new');
    };
    const gotoHome = () => {
        router.push('/home');
    };
    const back = () => {
        router.back();
    };

    const isOnHomePage = pathname === "/";
    const isOnNewPage = pathname === "/new";
    const isOnAddFromPage = pathname === "/addForm";
    const isOnDetail = pathname === "/detail";
    const isOnGetAll = pathname === "/getAll";

    
    //const isOnMenuPage = pathname === "/menu";
    return (
        <SafeAreaView className="bg-blue-600">
            <View className="px-4 py-3 flex-row items-center justify-between">
                <View className="flex-row items-center space-x-4">
                
                {isOnHomePage && (
                    <TouchableOpacity onPress={gotoHome}>
                       <AlignJustify size={24} color="#fff" />
                    </TouchableOpacity>
                    
                )}
                
                {!isOnHomePage && !isOnAddFromPage&& !isOnDetail && (
                    <TouchableOpacity onPress={backtoHome}>
                        <House size={24} color="#fff" />
                    </TouchableOpacity>
                )}

                    {!isOnHomePage&& !isOnNewPage && !isOnGetAll && (
                        <TouchableOpacity onPress={back}>
                            <ArrowLeft size={24} color="#fff" />
                        </TouchableOpacity>
                    )}
                </View>

                <Text className="text-white text-lg font-semibold">{title}</Text>
                {!isOnNewPage &&!isOnAddFromPage&& (
                <TouchableOpacity onPress={backtonew}>
                    <Plus size={24} color="#fff" />
                </TouchableOpacity>
                
                )}

                {isOnNewPage &&  (
                <Text></Text>)}
                
                {isOnAddFromPage &&  (
                <Text></Text>)}



            </View>
        </SafeAreaView>
    );
}
