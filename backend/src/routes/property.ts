import { Request, Response, Router } from "express";
import { middleware } from "../middleware.ts/authMiddleware";
import { listingSchema } from "../types/types";
import { prisma } from "../db/prisma";
import { v4 as uuidv4 } from "uuid";
import multer from "multer";
import s3 from "../awsConfig";
import { error, log } from "console";
// upload images that will be saved to S3 bucket and in frontend fetch from there

export const propertyRoutes = Router();
const upload = multer({ storage: multer.memoryStorage() });
propertyRoutes.post(
  "/list",
  upload.array("images"),
  middleware,
  async (req: Request, res: Response) => {


    const parseData = listingSchema.safeParse({
      title:req.body.title,
      description:req.body.description,
      category:req.body.category,
      roomCount:+req.body.roomCount,
      bathroomCount:+req.body.bathroomCount,
      guestCount:+req.body.guestCount,
      latitude:+req.body.latitude,
      longtitude: +req.body.longitude,
      price: +req.body.price
    });
    const files = req.files as Express.Multer.File[];
    const userId = req.userId;
    const username=req.username;
    console.log(username)


    if (!userId) {
      res.json({ msg: "No userId passed from middleware" });
      return;
    }
    try {
      if (parseData.error?.errors) {
        console.log(parseData.error);
      }
      if (!parseData.success) {
        res.status(400).json({ msg: "Validation error" });
        return;
      }
      if (!files) {
        res.status(400).json({ msg: "No image file" });
        return;
      }

      const uploadedImageUrls = await Promise.all(
        files.map(async (file) => {
          const params = {
            Bucket: process.env.S3_BUCKET_NAME!,
            Key: `listings/${uuidv4()}_${file.originalname}`,
            Body: file.buffer,
            ContentType: file.mimetype,
            ACL: "public-read",
          };

          const uploadResult = await s3.upload(params).promise();
          return uploadResult.Location;
        })
      );

      const property = await prisma.listing.create({
        data: {
          title: parseData.data.title,
          description: parseData.data.description,
          imageSrc: uploadedImageUrls,
          category: parseData.data.category,
          roomCount: parseData.data.roomCount,
          bathroomCount: parseData.data.bathroomCount,
          guestCount: parseData.data.guestCount,
          latitude: parseData.data.latitude!,
          longitude: parseData.data.longitude!,
          price: parseData.data.price,
          userId: userId,
          username:username
        },
      });
      res.status(200).json({ property });
    } catch (e) {
      console.log(e);
      res.status(400).json({ msg: "Error in property listing" });
    }
  }
);
propertyRoutes.get(
  "/filter",
  middleware,
  async (req: Request, res: Response) => {
    try {
      const { title, category, price, location } = req.query;
      const query: any = {};

      if (title && typeof title === "string" && title.trim() !== "") {
        query.title = title.trim();
      }

      if (location && typeof location === "string" && location.trim() !== "") {
        query.location = location.trim();
      }

      if (category && typeof category === "string" && category.trim() !== "") {
        query.category = category.trim();
      }

      if (price && typeof price === "string" && price.trim() !== "") {
        query.price = parseInt(price.trim()); // Convert to number since price in your schema appears to be numeric
      }

     

      const property = await prisma.listing.findMany({
        where: query,
      });

      if (property.length === 0) {
        res
          .status(200)
          .json({ msg: `No properties found matching the criteria` });
        return;
      }

      res.status(200).json({ property });
    } catch (e) {
      console.error("Error in filter route:", e);
      res.status(403).json({ msg: "Error in filter route of property" });
      return;
    }
  }
);
propertyRoutes.get(
  "/:propertyId",
  middleware,
  async (req: Request, res: Response) => {
    const { propertyId } = req.params;
    if (!propertyId) {
      res.status(400).json({
        msg: "Please provide Id",
      });
      return;
    }

    const property = await prisma.listing.findUnique({
      where: {
        id: propertyId,
      },
    });
    if (!property) {
      res.status(400).json({ msg: "No property for this ID" });
      return;
    }
    res.status(200).json({
      property,
    });
  }
);

propertyRoutes.get("/", middleware, async (req: Request, res: Response) => {
  const property = await prisma.listing.findMany();
  if (!property) {
    res.status(400).json({ msg: "something worng" });
    return;
  }
  res.status(200).json({
    property,
  });
});

propertyRoutes.delete(
  "/:propertyId",
  middleware,
  async (req: Request, res: Response) => {
    const { propertyId } = req.params;
    if (!propertyId) {
      res.status(400).json({
        msg: "Please provide Id",
      });
      return;
    }

    const property = await prisma.listing.findUnique({
      where: {
        id: propertyId,
      },
    });
    if (!property) {
      res.status(400).json({ msg: "No property for this ID" });
      return;
    }
    await prisma.listing.delete({
      where: {
        id: propertyId,
      },
    });

    res.status(200).json({
      msg: `Property with ID ${propertyId} deleted successfully. ${property}`,
    });
  }
);
