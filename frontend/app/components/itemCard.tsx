import { Text, View, TouchableOpacity } from 'react-native';
import { ButtonMain } from '@/app/components/button';
import { Edit, Trash2 } from 'lucide-react-native';

type ProductItemCardProps = {
    amount: number;
    typeTranfer: string;
    date: string;
    time: string;
    sender: string;
    recipient: string;
    detail: string;

    titleBtn: string;
    btnColor?: "primary" | "secondary" | "danger";
    btnSize?: "small" | "medium" | "large";
    onPress: () => void;
    onEdit?: () => void;
    onDelete?: () => void;
};

export const ItemCardMain = ({
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
        <View className="p-4 bg-white rounded-xl mb-4  relative border border-gray-300">
            <View style={{ position: 'absolute', top: 10, right: 15, flexDirection: 'row', gap: 15 }}>
                <TouchableOpacity onPress={onEdit}>
                    <Edit size={24} color="#4a86e8" />
                </TouchableOpacity>
                <TouchableOpacity onPress={onDelete}>
                    <Trash2 size={24} color="#e63946" />
                </TouchableOpacity>
            </View>

            <Text className="text-[20px] font-bold text-black">
                จำนวนเงิน : {amount ?? 0}
                {typeTranfer && typeTranfer !== '' && typeTranfer !== null && (
                    <Text className="text-[16px] text-gray-400">  ({typeTranfer})</Text>
                )}
            </Text>


            <Text className="text-[16px]">วันที่: {date}-{time} </Text>
            <Text className="text-[16px]">ผู้โอน : {sender ?? 'ไม่ระบุ'}</Text>
            <Text className="text-[16px]">ผู้รับ : {recipient ?? 'ไม่ระบุ'}</Text>
            <Text className="text-[16px]">รายละเอียด : {detail ?? 'ไม่ระบุ'}</Text>

        </View>
    );
};
