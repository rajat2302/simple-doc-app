import express from 'express';

import { getSheet,  getSheets, createSheet, updateSheet } from '../controllers/sheet.js';

const router = express.Router();

router.get("/sheets", getSheets);
router.post("/sheet", createSheet);
router.get("/sheet/:sheetName", getSheet);
router.put("/sheet/:sheetName", updateSheet);


export default router;