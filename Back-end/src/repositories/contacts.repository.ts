import { prisma } from "../database/prisma.client";
import { Contact, ContactCreate, ContactCreateData, ContactRepository } from "../interfaces/contact.interface";

class ContactsRepositoryPrisma implements ContactRepository {
   async create(data: ContactCreateData): Promise<Contact> {
      const result = await prisma.contacts.create({
         data: {
            email: data.email,
            name: data.name,
            phone: data.phone,
            userId: data.userId
         }
      })
      return result
   }
   async findByEmailOrPhone(email: string, phone: string): Promise<Contact | null> {
      const result = await prisma.contacts.findFirst({
         where: {
            OR: [
               { email, },
               { phone }
            ]
         }
      })
      return result || null
   }
}
export { ContactsRepositoryPrisma }