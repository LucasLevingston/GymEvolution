import { ContactCreate, ContactRepository } from './../interfaces/contact.interface';
import { ContactsRepositoryPrisma } from '../repositories/contacts.repository';

class ContactUseCase {
   private contactRepository: ContactRepository
   constructor() {
      this.contactRepository = new ContactsRepositoryPrisma()
   }
   async create({ email, name, phone, userId }: ContactCreate) {

   }
}
export { ContactUseCase }