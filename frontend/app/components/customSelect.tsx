import { Text, View } from "react-native";
import { Picker } from "@react-native-picker/picker";

type SelectInputProps = {
    className?: string;
    label?: string;
    value: string;
    onChangeText: (text: string) => void;
    placeholder: string;
    options: { label: string; value: string }[]; // เพิ่ม options
};

const CustomSelect = ({
    className,
    label,
    value,
    onChangeText,
    placeholder,
    options,
}: SelectInputProps) => {
    return (
        <View className="mb-4">
            {label && (
                <Text className="text-black font-bold text-left mb-1">{label}</Text>
            )}
            <View className="border border-gray-300 rounded-lg bg-white">
                <Picker
                    className={` ${className} border border-gray-300 rounded-lg px-4 py-2 bg-white `}
                    selectedValue={value}
                    onValueChange={(itemValue) => onChangeText(itemValue)}
                >
                    <Picker.Item label={placeholder} value="" color="#999" />
                    {options.map((opt) => (
                        <Picker.Item
                            key={opt.value}
                            label={opt.label}
                            value={opt.value}
                        />
                    ))}
                </Picker>
            </View>
        </View>
    );
};

export default CustomSelect;