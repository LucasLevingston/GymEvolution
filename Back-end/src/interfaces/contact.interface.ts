export interface Contact {
   name: string,
   email: string,
   phone: string,
   userId: string
}
export interface ContactCreate {
   name: string,
   email: string,
   phone: string,
   userEmail: string
}
export interface ContactCreateData {
   name: string,
   email: string,
   phone: string,
   userId: string
}



export interface ContactRepository {
   create(data: ContactCreateData): Promise<Contact>
   findByEmailOrPhone(email: string, phone: string): Promise<Contact | null>
}