// import { Text, View, TextInput } from "react-native";

// type CustomInputProps = {
//     label?: string;
//     value: string;
//     onChangeText: (text: string) => void;
//     placeholder: string;
//     type?: string;
//     className?: string;
// };


// export const CustomInput = ({
//     label,
//     value,
//     onChangeText,
//     placeholder,
//     type,
//     className,
// }: CustomInputProps) => {
//     const isTextarea = type === "textarea";

//     return (
//         <>
//             {label && (
//                 <Text className="text-black font-bold text-left mb-1">{label}</Text>
//             )}
//             <TextInput
//                 className={` ${className} border border-gray-300 rounded-lg px-4 py-2 bg-white ${isTextarea ? "h-20 py-2 text-top" : "h-12"
//                     }`}
//                 value={value}
//                 onChangeText={onChangeText}
//                 placeholder={placeholder}
//                 multiline={isTextarea}
//                 numberOfLines={isTextarea ? 2 : 1}
//                 textAlignVertical={isTextarea ? "top" : "center"}
//             />
//         </>
//     );
// };

import { Text, View, TextInput, Pressable, Platform } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { useState } from "react";

type CustomInputProps = {
  label?: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  type?: string; // 'text' | 'number' | 'textarea' | 'date'
  className?: string;
  keyboardType?: "default" | "numeric" | "email-address" | "phone-pad";
};

export const CustomInput = ({
  label,
  value,
  onChangeText,
  placeholder,
  type,
  className,
  keyboardType,
}: CustomInputProps) => {
  const isTextarea = type === "textarea";
  const isDate = type === "date";

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const showDatePicker = () => setDatePickerVisibility(true);
  const hideDatePicker = () => setDatePickerVisibility(false);

  const handleConfirm = (date: Date) => {
    // แปลงเป็น YYYY-MM-DD
    const isoDate = date.toISOString().split("T")[0];
    
    // ส่งค่าไปที่ state หรือ backend
    onChangeText(isoDate);  
    hideDatePicker();
  };
  
  

  if (isDate) {
    return (
      <>
        {label && <Text className="text-black font-bold mb-1">{label}</Text>}
        <Pressable
          onPress={showDatePicker}
          className={`border border-gray-300 rounded-lg px-4 py-3 bg-white ${className}`}
        >
          <Text className="text-black">
            {value || placeholder}
          </Text>
        </Pressable>
        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="date"
          display={Platform.OS === "ios" ? "inline" : "default"}
          onConfirm={handleConfirm}
          onCancel={hideDatePicker}
        />
      </>
    );
  }

  return (
    <>
      {label && <Text className="text-black font-bold mb-1">{label}</Text>}
      <TextInput
        className={` ${className} border border-gray-300 rounded-lg px-4 py-2 bg-white ${isTextarea ? "h-20" : "h-12"
          }`}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        multiline={isTextarea}
        numberOfLines={isTextarea ? 2 : 1}
        textAlignVertical={isTextarea ? "top" : "center"}
        keyboardType={type === "number" ? "decimal-pad" : "default"}
      />
    </>
  );
};
