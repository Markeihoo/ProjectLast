import { PrismaClient } from "@prisma/client";


const prisma = new PrismaClient();
export const getAllTranfers = async () => {
    return await prisma.transfer_slip_info.findMany();
};
export const getAllTranfersWithPagination = async (page: number, perPage: number) => {
    const total = await prisma.transfer_slip_info.count();
    const totalPages = Math.ceil(total / perPage);

    const data = await prisma.transfer_slip_info.findMany({
        skip: (page - 1) * perPage,
        take: perPage,
        orderBy: {
            created_at: 'desc',
        },
    });

    return {
        data,
        pagination: {
            currentPage: page,
            totalPages,
            totalItems: total,
            perPage,
        },
    };
};
export const getTranferById = async (id: string) => {
    return await prisma.transfer_slip_info.findUnique({ where: { id } });
};
export const createTranfer = async (data: any) => {
    return await prisma.transfer_slip_info.create({ data, });
};
export const updateTranfer = async (id: string, data: any) => {
    return await prisma.transfer_slip_info.update({ where: { id }, data });
};
export const deleteTranfer = async (id: string) => {
    return await prisma.transfer_slip_info.delete({ where: { id } });
};
export const getTranfersByMonth = async (month: string) => {
    const data = await prisma.transfer_slip_info.findMany({
        where: {
            date: {
                startsWith: month, // เช่น "2025-04"
            },
        },
        select: {
            date: true,
            amount: true,
            typeTranfer: true,
        },
    });
    if (data.length === 0) {
        return {
            totalMonthAmount: 0,
            dailySummary: {},
            typeSummary: {},
        };
    }
    const totalMonthAmount = data.reduce((sum, item) => sum + item.amount, 0);

    const dailySummary: { [date: string]: number } = {};
    data.forEach((item) => {
        if (item.date) {
            dailySummary[item.date] = (dailySummary[item.date] || 0) + item.amount;
        }
    });
    const typeSummary: Record<string, { count: number, totalAmount: number }> = {};
    for (const item of data) {
        const type = item.typeTranfer || "อื่นๆ";
        if (!typeSummary[type]) {
            typeSummary[type] = { count: 1, totalAmount: item.amount };
        } else {
            typeSummary[type].count++;
            typeSummary[type].totalAmount += item.amount;
        }
    }

    return {
        totalMonthAmount,
        dailySummary,
        typeSummary
    };
};

export const getTranfersByDate = async (date: string) => {
    return await prisma.transfer_slip_info.findMany({
        where: {
            date: date,
        },
        orderBy: {
            created_at: 'desc',
        },
    });
};
