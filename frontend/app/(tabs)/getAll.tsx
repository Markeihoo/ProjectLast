import { Text, View, ScrollView } from 'react-native';
import HeaderCustom from '@/app/components/header';
import { ItemCardMain } from '@/app/components/itemCard';
import PaginationCustom from '@/app/components/pagination';
import { useState } from 'react';
import { ButtonMain } from '../components/button';
import { router } from 'expo-router';

export default function GetAll() {
    const [page, setPage] = useState(1);
    const totalPages = 4;

    const handlePrev = () => {
        if (page > 1) setPage(page - 1);
    };

    const handleNext = () => {
        if (page < totalPages) setPage(page + 1);
    };

    return (
        <View style={{ flex: 1 }}>
            <HeaderCustom title="รายการทั้งหมด" />
            <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 30 }}>
                <ButtonMain title="เพิ่มรายการใหม่" btnSize="full" className="mb-4" onPress={() => router.push('/new')} />
                {Array.from({ length: 4 }).map((_, index) => (
                    <ItemCardMain
                        key={index}
                        amount={10}
                        typeTranfer="โอนเงิน"
                        date="2023-08-01"
                        time="10:00"
                        sender="John Doe"
                        recipient="Jane Smith"
                        detail="รายละเอียดเพิ่มเติม"
                        titleBtn="ลบ"
                        btnColor="danger"
                        onPress={() => { }}
                    />
                ))}
            </ScrollView>
            <PaginationCustom
                page={page}
                totalPages={totalPages}
                handlePrev={handlePrev}
                handleNext={handleNext}
            />
        </View>
    );
}
