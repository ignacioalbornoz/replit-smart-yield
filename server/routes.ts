import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertContactSchema } from "@shared/schema";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  app.post("/api/contacts", async (req, res) => {
    try {
      const result = insertContactSchema.safeParse(req.body);
      
      if (!result.success) {
        return res.status(400).json({ 
          message: "Datos inválidos", 
          errors: result.error.flatten().fieldErrors 
        });
      }
      
      const contact = await storage.createContact(result.data);
      return res.status(201).json(contact);
    } catch (error) {
      console.error("Error creating contact:", error);
      return res.status(500).json({ message: "Error interno del servidor" });
    }
  });

  app.get("/api/contacts", async (req, res) => {
    try {
      const contacts = await storage.getContacts();
      return res.json(contacts);
    } catch (error) {
      console.error("Error fetching contacts:", error);
      return res.status(500).json({ message: "Error interno del servidor" });
    }
  });

  return httpServer;
}
