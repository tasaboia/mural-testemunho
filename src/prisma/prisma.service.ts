import { Injectable, type OnModuleInit, type OnModuleDestroy } from "@nestjs/common"
import { PrismaClient } from "@prisma/client"

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    super({
      log: ["query", "info", "warn", "error"],
    })
  }

  async onModuleInit() {
    await this.$connect()
  }

  async onModuleDestroy() {
    await this.$disconnect()
  }

  async cleanDatabase() {
    if (process.env.NODE_ENV === "development" || process.env.NODE_ENV === "test") {
      const models = Reflect.ownKeys(this).filter((key) => {
        return typeof key === "string" && !key.startsWith("_") && key !== "constructor"
      })

      return Promise.all(
        models.map(async (modelKey) => {
          return this[modelKey].deleteMany()
        }),
      )
    }
  }
}

