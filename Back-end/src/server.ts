import fastify, { FastifyInstance } from "fastify"
import { userRoutes } from "./routes/user.routes"
import fastifyCors from "@fastify/cors";
import { historicoRoutes } from "./routes/historico.routes";

const app: FastifyInstance = fastify({ logger: false })

app.register(fastifyCors, {
   origin: '*'
})


app.register(userRoutes, {
   prefix: '/users'
})
app.register(historicoRoutes, {
   prefix: '/historico'
})


app.listen({
   port: 3100
}, () => console.log("Server is running on port 3100"))