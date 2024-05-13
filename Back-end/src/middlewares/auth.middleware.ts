export async function authMiddleware(req, reply) {
   const apiEmail = req.headers['email']

   if (!apiEmail) {
      reply.status(401).send({
         message: "Email is required"
      })
   }
}