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
   userId: string
}



export interface ContactRepository {
   create(data: ContactCreate): Promise<Contact>
}