import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';

interface Props {
    page: number;
    totalPages: number;
    handlePrev: () => void;
    handleNext: () => void;
}

export default function PaginationCustom({ page, totalPages, handlePrev, handleNext }: Props) {
    return (
        <View style={styles.pagination}>
            <TouchableOpacity onPress={handlePrev} disabled={page === 1}>
                <ChevronLeft size={30} color={page === 1 ? "#ccc" : "#4a86e8"} />
            </TouchableOpacity>
            <Text style={styles.pageText}>{page} จาก {totalPages}</Text>
            <TouchableOpacity onPress={handleNext} disabled={page === totalPages}>
                <ChevronRight size={30} color={page === totalPages ? "#ccc" : "#4a86e8"} />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    pagination: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 15,
        gap: 20,
    },
    pageText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
});
