import { Request, Response, Router } from "express";
import { middleware } from "../middleware.ts/authMiddleware";
import { listingSchema } from "../types/types";
import { prisma } from "../db/prisma";

export const propertyRoutes = Router();

propertyRoutes.post(
  "/list",
  middleware,
  async (req: Request, res: Response) => {
    const parseData = listingSchema.safeParse(req.body);
    const userId = req.userId;
    console.log(userId)
    if (!userId) {
      res.json({ msg: "No userId passed from middleware" });
    }
    try {
      if (!parseData.success) {
        res.status(400).json({ msg: "Validation error" });
        return;
      }

      const property = await prisma.listing.create({
        data: {
          title: parseData.data.title,
          description: parseData.data.description,
          imageSrc: parseData.data.imageSrc,
          category: parseData.data.category,
          roomCount: parseData.data.roomCount,
          bathroomCount: parseData.data.bathroomCount,
          guestCount: parseData.data.guestCount,
          latitude: parseData.data.latitude,
          longitude: parseData.data.longitude,
          price: parseData.data.price,
          userId: userId,
        },
      });
      res.status(200).json({ property });
    } catch (e) {
      console.log(e);
      res.status(400).json({ msg: "Error in property listing" });
    }
  }
);
propertyRoutes.get("/filter",middleware, async (req: Request, res: Response) => {
  try {
    const { title, category, price, location } = req.query;
    const query: any = {};

    // Add conditions only if the parameters exist and are non-empty
    if (title && typeof title === 'string' && title.trim() !== '') {
      query.title = title.trim();
    }

    if (location && typeof location === 'string' && location.trim() !== '') {
      query.location = location.trim();
    }

    if (category && typeof category === 'string' && category.trim() !== '') {
      query.category = category.trim();
    }

    if (price && typeof price === 'string' && price.trim() !== '') {
      query.price = parseInt(price.trim()); // Convert to number since price in your schema appears to be numeric
    }

    console.log('Filter query:', query);

    const property = await prisma.listing.findMany({
      where: query,
    });

    if (property.length === 0) {
       res.status(200).json({ msg: `No properties found matching the criteria` });
       return
    }

     res.status(200).json({ property });
     
  } catch (e) {
    console.error('Error in filter route:', e);
     res.status(403).json({ msg: "Error in filter route of property" });
     return
  }
});
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


propertyRoutes.get(
  "/",
  middleware,
  async (req: Request, res: Response) => {
  

    const property = await prisma.listing.findMany();
    if (!property) {
      res.status(400).json({ msg: "something worng" });
      return;
    }
    res.status(200).json({
      property
    });
  }
);

propertyRoutes.delete(
  "/:propertyId",
  middleware,
  async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!id) {
      res.status(400).json({
        msg: "Please provide Id",
      });
      return;
    }

    const property = await prisma.listing.findUnique({
      where: {
        id: id,
      },
    });
    if (!property) {
      res.status(400).json({ msg: "No property for this ID" });
      return;
    }
    await prisma.listing.delete({
      where: {
        id: id,
      },
    });

    res.status(200).json({
      msg: `Property with ID ${id} deleted successfully. ${property}`,
    });
  }
);



