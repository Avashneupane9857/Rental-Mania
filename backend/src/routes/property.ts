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

propertyRoutes.get(
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
    res.status(200).json({
      property,
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

propertyRoutes.get("/", async (req: Request, res: Response) => {
  const { title, category, price } = req.query;
  const query: any = {};
  if (title) {
    query.title = title as string;
  }

  if (category) {
    query.category = category as string;
  }
  if (price) {
    query.price = price as string;
  }

  try {
    const property = await prisma.listing.findMany({
      where: query,
    });
    if (!property) {
      res.status(200).json({ msg: `NO property with ${query} ` });
    }
    res.status(200).json({ property });
  } catch (e) {
    res.status(403).json({ msg: "some error in filter route of property" });
  }
});
