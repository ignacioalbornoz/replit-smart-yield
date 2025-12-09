import { type User, type InsertUser, type Contact, type InsertContact } from "@shared/schema";
import { randomUUID } from "crypto";
import { readFileSync, writeFileSync, existsSync } from "fs";
import { join } from "path";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createContact(contact: InsertContact): Promise<Contact>;
  getContacts(): Promise<Contact[]>;
}

interface DataFile {
  users: User[];
  contacts: Contact[];
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private contacts: Map<string, Contact>;

  constructor() {
    this.users = new Map();
    this.contacts = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createContact(insertContact: InsertContact): Promise<Contact> {
    const id = randomUUID();
    const contact: Contact = { 
      id, 
      name: insertContact.name, 
      email: insertContact.email, 
      phone: insertContact.phone || null 
    };
    this.contacts.set(id, contact);
    return contact;
  }

  async getContacts(): Promise<Contact[]> {
    return Array.from(this.contacts.values());
  }
}

export class JsonStorage implements IStorage {
  private dataPath: string;
  private data: DataFile;

  constructor(dataPath?: string) {
    this.dataPath = dataPath || join(process.cwd(), "data.json");
    this.data = this.loadData();
  }

  private loadData(): DataFile {
    if (existsSync(this.dataPath)) {
      try {
        const fileContent = readFileSync(this.dataPath, "utf-8");
        return JSON.parse(fileContent);
      } catch (error) {
        console.error("Error loading data file, starting with empty data:", error);
        return { users: [], contacts: [] };
      }
    }
    return { users: [], contacts: [] };
  }

  private saveData(): void {
    try {
      writeFileSync(this.dataPath, JSON.stringify(this.data, null, 2), "utf-8");
    } catch (error) {
      console.error("Error saving data file:", error);
      throw error;
    }
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.data.users.find((user) => user.id === id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return this.data.users.find((user) => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.data.users.push(user);
    this.saveData();
    return user;
  }

  async createContact(insertContact: InsertContact): Promise<Contact> {
    const id = randomUUID();
    const contact: Contact = { 
      id, 
      name: insertContact.name, 
      email: insertContact.email, 
      phone: insertContact.phone || null 
    };
    this.data.contacts.push(contact);
    this.saveData();
    return contact;
  }

  async getContacts(): Promise<Contact[]> {
    return [...this.data.contacts];
  }
}

// Usar JsonStorage por defecto en lugar de MemStorage
export const storage = new JsonStorage();
