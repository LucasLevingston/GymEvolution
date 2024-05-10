import { Contact, ContactCreate, ContactRepository } from "../interfaces/contact.interface";

class ContactsRepositoryPrisma implements ContactRepository {
   create(data: ContactCreate): Promise<Contact> {

   }
}
export { ContactsRepositoryPrisma }