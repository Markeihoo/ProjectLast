import e, { Request, Response } from "express";
import * as TranferService from "../service/tranfer-service";
import { z, ZodError } from "zod";

const TranferSchema = z.object({
    sender: z.string().min(1, { message: "sender is required" }),
    recipient: z.string().optional(),
    amount: z.number().min(1, { message: "amount is required" }),
    date: z.string().optional(),
    time: z.string().optional(),
    slip_ref: z.string().optional(),
    detail: z.string().optional(),
    typeTranfer: z.string().optional(),
    created_at: z.string().optional(),
    updated_at: z.string().optional(),
});

export const getTranfers = async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const perPage = 20;

    const result = await TranferService.getAllTranfersWithPagination(page, perPage);

    res.json(result);
};

export const getTranfer = async (req: Request, res: Response) => {
    const tranfer = await TranferService.getTranferById(req.params.id);
    if (tranfer) {
        res.json(tranfer);
    } else {
        res.status(404).json({ message: "No tranfer found" });
    }
};

export const createTranfer = async (req: Request, res: Response) => {
    try {
        const validatedData = TranferSchema.parse(req.body);
        console.log(validatedData);

        const tranfer = await TranferService.createTranfer(validatedData);
        res.status(201).json(tranfer);
    } catch (error) {
        if (error instanceof ZodError) {
            res.status(400).json({ message: error.message });
        } else if (error instanceof Error) {
            res.status(500).json({ message: error.message });
        } else {
            res.status(500).json({ message: "Unknown error occurred" });
        }
    }
};

export const updateTranfer = async (req: Request, res: Response) => {
    try {
        const validatedData = TranferSchema.partial().parse(req.body);
        const tranfer = await TranferService.updateTranfer(req.params.id, validatedData);
        res.json(tranfer);
    } catch (error) {
        if (error instanceof ZodError) {
            res.status(400).json({ message: error.message });
        } else if (error instanceof Error) {
            res.status(500).json({ message: error.message });
        } else {
            res.status(500).json({ message: "Unknown error occurred" });
        }
    };
};

export const deleteTranfer = async (req: Request, res: Response) => {
    try {
        await TranferService.deleteTranfer(req.params.id);
        res.sendStatus(204);
    } catch (error) {
        res.status(500).json({ message: "Tranfer not found" });
    }
};
export const getTranfersByOneMonth = async (req: Request, res: Response): Promise<void> => {
    try {
        const month = req.query.month as string;
        const year = req.query.year as string;

        if (!month || !year) {
            res.status(400).json({ message: "Month and year are required" });
            return;
        }

        const monthNumber = parseInt(month, 10);
        if (monthNumber < 1 || monthNumber > 12) {
            res.status(400).json({ message: "Invalid month. Must be between 01 and 12" });
            return;
        }

        if (isNaN(parseInt(year, 10))) {
            res.status(400).json({ message: "Invalid year format" });
            return;
        }

        const formattedMonth = `${year}-${month.padStart(2, "0")}`;
        const result = await TranferService.getTranfersByMonth(formattedMonth);

        // if (!result.dailySummary || Object.keys(result.dailySummary).length === 0) {
        //     res.status(404).json({ message: "No transfer data found for this month" });
        //     return;
        // }

        res.json(result); // ✅ แค่ไม่ต้องใช้ return ที่นี่
    } catch (error) {
        console.error("Error occurred while fetching data: ", error);
        res.status(500).json({ message: "Error fetching data" });
    }
};


export const getTranfersByDate = async (req: Request, res: Response): Promise<void> => {
    try {
        const date = req.query.date as string;
        const result = await TranferService.getTranfersByDate(date);
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: "Error fetching data" });
    }
};