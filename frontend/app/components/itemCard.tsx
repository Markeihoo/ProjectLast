import { Text, View, TouchableOpacity } from 'react-native';
import { ButtonMain } from '@/app/components/button';
import { Edit, Trash2 } from 'lucide-react-native';
import dayjs from "dayjs";
import "dayjs/locale/th";
import buddhistEra from "dayjs/plugin/buddhistEra";
import localizedFormat from "dayjs/plugin/localizedFormat";

dayjs.locale("th");
dayjs.extend(buddhistEra);
dayjs.extend(localizedFormat);
type ProductItemCardProps = {
    amount: number;
    typeTranfer: string;
    date: string;
    time: string;
    sender: string;
    recipient: string;
    detail: string;

    titleBtn?: string;
    btnColor?: "primary" | "secondary" | "danger";
    btnSize?: "small" | "medium" | "large";
    onPress?: () => void;
    onEdit?: () => void;
    onDelete?: () => void;
};

const ItemCardMain = ({
    amount,
    typeTranfer,
    date,
    time,
    sender,
    recipient,
    detail,

    titleBtn,
    btnColor = "primary",
    btnSize = "medium",
    onPress,
    onEdit,
    onDelete
}: ProductItemCardProps) => {
    return (
        <TouchableOpacity onPress={onPress} activeOpacity={0.9}>
            <View className="p-2 bg-white rounded-xl mb-4 relative border border-gray-300">
                {/* ปุ่มแก้ไขและลบ */}
                <View style={{ position: 'absolute', top: 10, right: 15, flexDirection: 'row', gap: 15, zIndex: 10 }}>
                    <TouchableOpacity onPress={onEdit}>
                        <Edit size={24} color="#4a86e8" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={onDelete}>
                        <Trash2 size={24} color="#e63946" />
                    </TouchableOpacity>
                </View>

                {/* รายละเอียด */}
                <Text className="text-[20px] font-bold text-black py-2">
                    🪙 {amount.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}{''}
                    {typeTranfer && (
                        <Text className="text-[16px] text-gray-400">  ({typeTranfer})</Text>
                    )}
                </Text>

                <Text className="text-[16px] text-gray-500">วันที่: {dayjs(date).format('DD MMM BB')} {time} </Text>
                <Text className="text-[16px] text-gray-500">ผู้โอน : {sender ?? 'ไม่ระบุ'}</Text>
                <Text className="text-[16px] text-gray-500">ผู้รับ : {recipient ?? 'ไม่ระบุ'}</Text>
                <Text className="text-[16px] text-gray-500">รายละเอียด : {detail ?? '-'}</Text>
            </View>
        </TouchableOpacity>
    );
};
export default ItemCardMain;