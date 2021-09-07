import SheetData from "../models/saveText.js";

/* 
*Api call to get all the docs 
*/
export const getSheets = async (req, res) => {
    try{
        const sheetText = await SheetData.find();

        console.log(sheetText[0].changes.text);

        res.status(200).json(sheetText);
    }catch( error ){
        res.status(404).json({ message: error.message});
    }
}

/*
* API call to get a single doc
*/
export const getSheet = async (req, res) => {
    try {
        const sheetName = req.params.sheetName;
        console.log(sheetName);
        const singleSheet = await SheetData.find({_id: sheetName});

        console.log(singleSheet);

        res.status(200).json(singleSheet);
    } catch (error) {
        res.status(404).json({message: error.message});
    }
}

/*
*API call to create a new Doc 
*/

export const createSheet = async (req, res) => {
    const sheet = req.body;
    console.log(sheet);
    const newText = await SheetData(sheet);
    try {
        newText.save();

        res.status(201).json(newText);
    } catch (error) {
        res.status(409).json({message: error.message});
    }
}

/*
* API to update Doc data
*/
export const updateSheet = async (req, res) => {
    try {
        const sheetName = req.params.sheetName;
        const sheetData = req.body;
        console.log(sheetName);
        console.log(sheetData);
        const updateSheetData = await SheetData.updateOne({_id: sheetName}, {$set : {patchs: sheetData}});

        console.log(updateSheetData);
        res.status(200).json(updateSheetData);
    } catch (error) {
        res.status(404).json({message: error.message});
    }
}
