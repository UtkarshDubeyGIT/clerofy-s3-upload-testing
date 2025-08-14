import  {Request, Response }from 'express';
import sharp from "sharp";
import s3 from "../config/s3";

export const uploadImage = async (req: Request, res: Response) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded" });
        }

        //compress image
        const compressedBuffer = await sharp(req.file.buffer)
            .resize({ width: 800, height: 600 }) //optional size
            .toFormat("jpeg")
            .jpeg({ quality: 70 }) //customizable
            .toBuffer();

        //upload to s3
        const key = `uploads/${Date.now()}-${req.file.originalname}`;
        const result = await s3.upload({
            Bucket: process.env.AWS_S3_BUCKET || "",
            Key: key,
            Body: compressedBuffer,
            ContentType: "image/jpeg"
        }).promise();

        res.status(200).json({ 
            message: "uploaded successfully",
            url: result.Location });
    } catch (error) {
        console.error("Error uploading image:", error);
        res.status(500).json({ error: "Failed to upload image" });
    }
}