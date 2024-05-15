import fastify, { FastifyInstance } from "fastify"
import { userRoutes } from "./routes/user.routes"
import fastifyCors from "@fastify/cors";

const app: FastifyInstance = fastify({ logger: false })

app.register(fastifyCors, {
   origin: '*'
})


app.register(userRoutes, {
   prefix: '/users'
})


app.listen({
   port: 3100
}, () => console.log("Server is running on port 3100"))