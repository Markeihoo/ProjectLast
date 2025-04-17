import { Text, View, TouchableOpacity } from "react-native";
import { Feather } from '@expo/vector-icons';
import { ReactNode } from "react";

type ButtonProps = {
    title?: string;
    children?: ReactNode;
    btnColor?: "primary" | "secondary" | "danger" | "submit";
    onPress: () => void;
    btnSize?: "small" | "medium" | "large" | "full" | "menu";
    arrow?: boolean;
    className?: string;
};

export const ButtonMain = ({
    title,
    children,
    btnColor = "primary",
    onPress,
    btnSize = "medium",
    arrow = false,
    className,
}: ButtonProps) => {
    const btnColorClasses = {
        primary: "bg-blue-500 active:bg-opacity-70 hover:bg-blue-700",
        secondary: "bg-gray-500 active:bg-opacity-70 hover:bg-gray-700",
        danger: "bg-red-500 active:bg-opacity-70 hover:bg-red-700",
        submit: "bg-green-500 active:bg-opacity-70 hover:bg-green-700"
    };

    const btnSizeClasses = {
        small: "px-2 py-1 text-sm",
        medium: "px-4 py-2 text-xl",
        large: "px-6 py-3 text-2xl",
        full: "w-full px-4 py-2 text-2xl",
        menu: "w-full px-4 py-3 text-2xl py-4 rounded-3xl"
    };

    return (
        <TouchableOpacity
            className={[
                "rounded-xl",
                "self-start",
                "self-stretch",
                "px-4 py-2 mt-3",
                btnColorClasses[btnColor],
                btnSizeClasses[btnSize],
                className
            ].join(" ")}
            onPress={onPress}
        >
            <View className="flex-row items-center justify-between">
                <View className="flex-1 items-center flex-row justify-center">
                    {children ? (
                        children
                    ) : (
                        <Text className="text-white font-bold text-center">{title}</Text>
                    )}
                </View>
                {arrow && <Feather name="chevron-right" size={20} color="white" />}
            </View>
        </TouchableOpacity>
    );
};
