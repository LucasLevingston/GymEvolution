import { vi } from 'vitest'
import { mockDeep } from 'vitest-mock-extended'
import type { PrismaClient } from '@prisma/client'

// Mock the prisma client
vi.mock('../lib/prisma', () => ({
  prisma: mockDeep<PrismaClient>(),
}))

// Mock the JWT verification
vi.mock('@fastify/jwt', () => ({
  default: () => ({
    sign: vi.fn().mockReturnValue('mocked-token'),
    verify: vi.fn().mockReturnValue({ id: 'user-id', role: 'STUDENT' }),
  }),
}))

// Mock bcryptjs
vi.mock('bcryptjs', () => ({
  hash: vi.fn().mockResolvedValue('hashed-password'),
  compare: vi.fn().mockResolvedValue(true),
}))
