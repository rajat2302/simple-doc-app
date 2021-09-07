import mongoose from "mongoose";

/*
 * DB schema for data to save
 */
const sheetSchema = mongoose.Schema({
  sheetName: String,
  changes: [
    {
      text: {
        type: String,
        default: " ",
      },
      dateData: {
        type: Date,
        default: new Date(),
      },
    },
  ],
  patchs: [
    {
      patch: [],
      dateData: {
        type: Date,
        default: new Date(),
      },
    },
  ],
});

/*
 * Model creation for node to use
 */
const SheetData = mongoose.model("SheetData", sheetSchema);

export default SheetData;
