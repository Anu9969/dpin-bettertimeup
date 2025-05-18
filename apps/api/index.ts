import express from "express";
import { authMiddleware } from "./middleware";
import { prismaClient } from "db/client";

const app = express();

app.use(express.json());

app.post("api/v1/website",authMiddleware,async (req,res) =>{
    const userId = req.userId!;
    const {url} = req.body;

    //auth middleware se userId mila hai and url too usko niche db m dump krrhe
    const data = await prismaClient.website.create({
        data: {
            url,
            userId
        }   
    })

    res.json({
        id: data.id,
    })

    res.status(201).json(data);
})

app.get("api/v1/website/status",authMiddleware, async (req,res): Promise<void> => {
    const websiteId = req.query.websiteId! as unknown as string;
    const userId = req.userId;

    const data = await prismaClient.website.findFirst({
        where:{
            id: websiteId,
            userId,
            disabled: false
        },
        include:{
            ticks: true
        }
    })

    if(!data){
        res.status(404).json({
            error: "Website not found"
        });
        return;
    }

    res.json(data);
})

app.get("api/v1/website/:id",authMiddleware, async (req,res) =>{
    const userId = req.userId;

    const websites = await prismaClient.website.findMany({
        where:{
            userId,
            disabled: false
        }
    })

    res.json({
        websites
    })
})

app.delete("api/v1/website/:id",authMiddleware, async (req,res) =>{
    const websiteId = req.body.websiteId;
    const userId = req.userId;

    const data = await prismaClient.website.update({
        where:{
            id: websiteId,
            userId
        },
        data:{
            disabled: true
        }
    })

    res.json({
        message: "Website deleted successfully"
    });
})







app.listen(3000);
