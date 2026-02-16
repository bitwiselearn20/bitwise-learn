import type { Request,Response } from "express";
import { handleSendContactEmail } from "../utils/nodemailer/mailHandler";
import apiResponse from "../utils/apiResponse";

export const handleContactForm = async (req:Request,res:Response) => {
    try {
        const {name,email,phone,message} = req.body;

        if(!name || !email || !message){
            return res.status(400).json({
                success:false,
                message:"Name,email and message are Required"
            });
        }

        const response = await handleSendContactEmail({
            name,email,phone,message
        });

        console.log(response);

        return res.status(200).json(apiResponse(200,"Contact Email Send !",null));
    } catch (error:any) {
        console.log("Error while Sending Email : ",error.message);
        return res.status(500).json(apiResponse(500,"Failed to Send Complaint",null));
    }
}