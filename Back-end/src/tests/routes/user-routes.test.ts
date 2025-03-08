import { describe, it, expect, vi, beforeEach } from "vitest"
import { buildTestServer } from "../utils/test-server"
import { userRoutes } from "../../routes/user-routes"
import { UserController } from "../../controllers/user-controller"
import { mockUserService } from "../mocks/services"

vi.mock("../../controllers/user-controller", () => {
  return {
    UserController: vi.fn().mockImplementation(() => ({
      getAllUsers: vi.fn(),
      getUserById: vi.fn(),
      updateUser: vi.fn(),
      deleteUser: vi.fn(),
      getAllNutritionists: vi.fn(),
      getAllTrainers: vi.fn(),
      assignNutritionist: vi.fn(),
      assignTrainer: vi.fn(),
      getNutritionistStudents: vi.fn(),
      getTrainerStudents: vi.fn(),
    })),
  }
})

describe("User Routes", () => {
  let server: any
  let userController: any

  beforeEach(async () => {
    server = buildTestServer()

    // Mock JWT verification
    server.jwt.verify = vi.fn().mockReturnValue({ id: "user-id", role: "ADMIN" })

    await server.register(userRoutes)

    // Get the mocked controller instance
    userController = (UserController as any).mock.results[0].value

    // Set up the mock implementations
    userController.getAllUsers.mockImplementation(async (req, reply) => {
      return reply.send(mockUserService.getAllUsers())
    })

    userController.getUserById.mockImplementation(async (req, reply) => {
      return reply.send(mockUserService.getUserById())
    })

    userController.updateUser.mockImplementation(async (req, reply) => {
      return reply.send(mockUserService.updateUser())
    })

    userController.deleteUser.mockImplementation(async (req, reply) => {
      return reply.send({ message: "User deleted successfully" })
    })

    userController.getAllNutritionists.mockImplementation(async (req, reply) => {
      return reply.send(mockUserService.getAllNutritionists())
    })

    userController.getAllTrainers.mockImplementation(async (req, reply) => {
      return reply.send(mockUserService.getAllTrainers())
    })

    userController.assignNutritionist.mockImplementation(async (req, reply) => {
      return reply.status(201).send(mockUserService.assignNutritionist())
    })

    userController.assignTrainer.mockImplementation(async (req, reply) => {
      return reply.status(201).send(mockUserService.assignTrainer())
    })

    userController.getNutritionistStudents.mockImplementation(async (req, reply) => {
      return reply.send(mockUserService.getNutritionistStudents())
    })

    userController.getTrainerStudents.mockImplementation(async (req, reply) => {
      return reply.send(mockUserService.getTrainerStudents())
    })
  })

  describe("GET /", () => {
    it("should get all users", async () => {
      const response = await server.inject({
        method: "GET",
        url: "/",
        headers: {
          authorization: "Bearer token",
        },
      })

      expect(response.statusCode).toBe(200)
      expect(userController.getAllUsers).toHaveBeenCalled()

      const responseBody = JSON.parse(response.body)
      expect(Array.isArray(responseBody)).toBe(true)
    })
  })

  describe("GET /:id", () => {
    it("should get a user by ID", async () => {
      const response = await server.inject({
        method: "GET",
        url: "/user-id",
        headers: {
          authorization: "Bearer token",
        },
      })

      expect(response.statusCode).toBe(200)
      expect(userController.getUserById).toHaveBeenCalled()

      const responseBody = JSON.parse(response.body)
      expect(responseBody).toHaveProperty("id")
      expect(responseBody).toHaveProperty("name")
      expect(responseBody).toHaveProperty("email")
      expect(responseBody).toHaveProperty("role")
    })
  })

  describe("PUT /:id", () => {
    it("should update a user", async () => {
      const response = await server.inject({
        method: "PUT",
        url: "/user-id",
        headers: {
          authorization: "Bearer token",
        },
        payload: {
          name: "Updated Name",
          currentWeight: "75",
        },
      })

      expect(response.statusCode).toBe(200)
      expect(userController.updateUser).toHaveBeenCalled()

      const responseBody = JSON.parse(response.body)
      expect(responseBody).toHaveProperty("id")
      expect(responseBody).toHaveProperty("name")
    })
  })

  describe("DELETE /:id", () => {
    it("should delete a user", async () => {
      const response = await server.inject({
        method: "DELETE",
        url: "/user-id",
        headers: {
          authorization: "Bearer token",
        },
      })

      expect(response.statusCode).toBe(200)
      expect(userController.deleteUser).toHaveBeenCalled()

      const responseBody = JSON.parse(response.body)
      expect(responseBody).toHaveProperty("message")
      expect(responseBody.message).toBe("User deleted successfully")
    })
  })

  describe("GET /role/nutritionists", () => {
    it("should get all nutritionists", async () => {
      const response = await server.inject({
        method: "GET",
        url: "/role/nutritionists",
        headers: {
          authorization: "Bearer token",
        },
      })

      expect(response.statusCode).toBe(200)
      expect(userController.getAllNutritionists).toHaveBeenCalled()

      const responseBody = JSON.parse(response.body)
      expect(Array.isArray(responseBody)).toBe(true)
    })
  })

  describe("GET /role/trainers", () => {
    it("should get all trainers", async () => {
      const response = await server.inject({
        method: "GET",
        url: "/role/trainers",
        headers: {
          authorization: "Bearer token",
        },
      })

      expect(response.statusCode).toBe(200)
      expect(userController.getAllTrainers).toHaveBeenCalled()

      const responseBody = JSON.parse(response.body)
      expect(Array.isArray(responseBody)).toBe(true)
    })
  })

  describe("POST /assign/nutritionist", () => {
    it("should assign a nutritionist to a student", async () => {
      const response = await server.inject({
        method: "POST",
        url: "/assign/nutritionist",
        headers: {
          authorization: "Bearer token",
        },
        payload: {
          studentId: "student-id",
          nutritionistId: "nutritionist-id",
        },
      })

      expect(response.statusCode).toBe(201)
      expect(userController.assignNutritionist).toHaveBeenCalled()

      const responseBody = JSON.parse(response.body)
      expect(responseBody).toHaveProperty("id")
      expect(responseBody).toHaveProperty("nutritionistId")
      expect(responseBody).toHaveProperty("studentId")
      expect(responseBody).toHaveProperty("status")
    })
  })

  describe("POST /assign/trainer", () => {
    it("should assign a trainer to a student", async () => {
      const response = await server.inject({
        method: "POST",
        url: "/assign/trainer",
        headers: {
          authorization: "Bearer token",
        },
        payload: {
          studentId: "student-id",
          trainerId: "trainer-id",
        },
      })

      expect(response.statusCode).toBe(201)
      expect(userController.assignTrainer).toHaveBeenCalled()

      const responseBody = JSON.parse(response.body)
      expect(responseBody).toHaveProperty("id")
      expect(responseBody).toHaveProperty("trainerId")
      expect(responseBody).toHaveProperty("student2Id")
      expect(responseBody).toHaveProperty("status")
    })
  })

  describe("GET /nutritionist/students", () => {
    it("should get all students for a nutritionist", async () => {
      // Mock JWT verification for nutritionist
      server.jwt.verify = vi.fn().mockReturnValue({ id: "nutritionist-id", role: "NUTRITIONIST" })

      const response = await server.inject({
        method: "GET",
        url: "/nutritionist/students",
        headers: {
          authorization: "Bearer token",
        },
      })

      expect(response.statusCode).toBe(200)
      expect(userController.getNutritionistStudents).toHaveBeenCalled()

      const responseBody = JSON.parse(response.body)
      expect(Array.isArray(responseBody)).toBe(true)
    })
  })

  describe("GET /trainer/students", () => {
    it("should get all students for a trainer", async () => {
      // Mock JWT verification for trainer
      server.jwt.verify = vi.fn().mockReturnValue({ id: "trainer-id", role: "TRAINER" })

      const response = await server.inject({
        method: "GET",
        url: "/trainer/students",
        headers: {
          authorization: "Bearer token",
        },
      })

      expect(response.statusCode).toBe(200)
      expect(userController.getTrainerStudents).toHaveBeenCalled()

      const responseBody = JSON.parse(response.body)
      expect(Array.isArray(responseBody)).toBe(true)
    })
  })
})

