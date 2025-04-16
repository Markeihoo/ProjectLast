import { Text, View, TextInput } from "react-native";

type CustomInputProps = {
    label?: string;
    value: string;
    onChangeText: (text: string) => void;
    placeholder: string;
    type?: string;
    className?: string;
};


export const CustomInput = ({
    label,
    value,
    onChangeText,
    placeholder,
    type,
    className,
}: CustomInputProps) => {
    const isTextarea = type === "textarea";

    return (
        <>
            {label && (
                <Text className="text-black font-bold text-left mb-1">{label}</Text>
            )}
            <TextInput
                className={` ${className} border border-gray-300 rounded-lg px-4 py-2 bg-white ${isTextarea ? "h-20 py-2 text-top" : "h-12"
                    }`}
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                multiline={isTextarea}
                numberOfLines={isTextarea ? 2 : 1}
                textAlignVertical={isTextarea ? "top" : "center"}
            />
        </>
    );
};
