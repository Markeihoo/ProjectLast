import express from "express";
import * as TranferController from "../controller/tranfer-controller";

const router = express.Router();

router.get("/tranfersAllWithPagination", TranferController.getTranfers);
router.get("/tranfersByMonth", TranferController.getTranfersByOneMonth); //ใส่หน้า reportแสดงยอดรวมแต่ละวันและรวมทั้งเดือน
router.get("/tranfers/:id", TranferController.getTranfer);
router.post("/tranfers", TranferController.createTranfer);
router.put("/tranfers/:id", TranferController.updateTranfer);
router.delete("/tranfers/:id", TranferController.deleteTranfer);
router.get("/tranfersByDate", TranferController.getTranfersByDate); //ใส่หน้า report>detailรายวัน

export default router;
