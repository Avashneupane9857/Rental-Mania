import { Request, Response, Router } from "express";
import { middleware } from "../middleware.ts/authMiddleware";
import { listingSchema } from "../types/types";
import { prisma } from "../db/prisma";
import { v4 as uuidv4 } from "uuid";
import multer from "multer";
import s3 from "../awsConfig";
import { error, log } from "console";
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
      longitude: +req.body.longitude,
      price: +req.body.price,
      propertyName:req.body.propertyName,
      locationName:req.body.locationName
      
    });
    const files = req.files as Express.Multer.File[];
    const userId = req.userId;
    const username=req.username;
    


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
          latitude: parseData.data.latitude,
          longitude: parseData.data.longitude,
          price: parseData.data.price,
          userId: userId,
          username:username,

          locationName:parseData.data.locationName,
          propertyName:parseData.data.propertyName
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
  "/filter/",
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

propertyRoutes.get("/",  async (req: Request, res: Response) => {
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


propertyRoutes.get(
  "/host/properties",
  middleware,
  async (req: Request, res: Response) => {
    const userId = req.userId;

    if (!userId) {
      res.status(401).json({ msg: "Unauthorized: No user ID provided" });
      return;
    }

    try {
      const hostProperties = await prisma.listing.findMany({
        where: {
          userId: userId
        },
       
      });

      if (hostProperties.length === 0) {
        res.status(200).json({ 
          msg: "No properties found for this host",
          properties: [] 
        });
        return;
      }

      res.status(200).json({
         hostProperties,
      });
    } catch (error) {
      console.error("Error fetching host properties:", error);
      res.status(500).json({ msg: "Error fetching host properties" });
    }
  }
);






// edit route yo chai for host ko specific property


propertyRoutes.put(
  "/:propertyId",
  upload.array("images"),
  middleware,
  async (req: Request, res: Response) => {
    const { propertyId } = req.params;
    const userId = req.userId;
    const files = req.files as Express.Multer.File[];
    const { imagesToKeep } = req.body; 
    
    if (!userId) {
       res.status(401).json({ msg: "Unauthorized" });
       return
    }

    try {
    
      const existingProperty = await prisma.listing.findFirst({
        where: {
          id: propertyId,
          userId: userId
        }
      });

      if (!existingProperty) {
         res.status(404).json({ msg: "Property not found or unauthorized" });
         return
      }

      const parseData = listingSchema.safeParse({
        title: req.body.title,
        description: req.body.description,
        category: req.body.category,
        roomCount: +req.body.roomCount,
        bathroomCount: +req.body.bathroomCount,
        guestCount: +req.body.guestCount,
        latitude: +req.body.latitude,
        longitude: +req.body.longitude,
        price: +req.body.price,
        propertyName: req.body.propertyName,
        locationName: req.body.locationName
      });

      if (!parseData.success) {
         res.status(400).json({ msg: "Validation error" });
         return
      }

    
      let finalImageUrls = imagesToKeep ? JSON.parse(imagesToKeep) : [];

     
      const imagesToDelete = existingProperty.imageSrc.filter(
        (url: string) => !finalImageUrls.includes(url)
      );

      for (const imageUrl of imagesToDelete) {
        const key = imageUrl.split('/').pop(); 
        try {
          await s3.deleteObject({
            Bucket: process.env.S3_BUCKET_NAME!,
            Key: `listings/${key}`
          }).promise();
        } catch (error) {
          console.error(`Failed to delete image ${key} from S3:`, error);
        }
      }

      if (files && files.length > 0) {
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
        finalImageUrls = [...finalImageUrls, ...uploadedImageUrls];
      }

      const updatedProperty = await prisma.listing.update({
        where: {
          id: propertyId
        },
        data: {
          title: parseData.data.title,
          description: parseData.data.description,
          imageSrc: finalImageUrls,
          category: parseData.data.category,
          roomCount: parseData.data.roomCount,
          bathroomCount: parseData.data.bathroomCount,
          guestCount: parseData.data.guestCount,
          latitude: parseData.data.latitude,
          longitude: parseData.data.longitude,
          price: parseData.data.price,
          locationName: parseData.data.locationName,
          propertyName: parseData.data.propertyName
        }
      });

      res.status(200).json({ property: updatedProperty });
    } catch (error) {
      console.error("Error updating property:", error);
      res.status(500).json({ msg: "Error updating property" });
    }
  }
);