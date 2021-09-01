import mongoose from "mongoose";

const sheetSchema = mongoose.Schema({
    sheetName: String,
    changes: [{
        text: {
            type: String,
            default: " ",
        },
        dateData: {
            type: Date,
            default: new Date(),
        }
    }]
});

const SheetData = mongoose.model('SheetData', sheetSchema);

export default SheetData;