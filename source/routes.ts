import { FastifyInstance } from "fastify"
import { prisma } from "./lib/prisma"
import { z } from "zod"
import daysjs from 'dayjs'

export async function routes(app: FastifyInstance) {
  app.get('/', async () => {
    const habits = await prisma.habit.findMany()
    return habits
  })

  app.post('/createHabit', async (request, response) => {
    const createHabitBody = z.object({
      title: z.string(),
      weekDays: z.array(
        z.number().min(0).max(6)
      )
    })

    const { title, weekDays } = createHabitBody.parse(request.body)

    const today = daysjs().startOf('day').toDate()

    await prisma.habit.create({
      data: {
        title,
        createdAt: today,
        HabitWeekDays: {
          create: weekDays.map(weekDays => {
            return {
              week_day: weekDays
            }
          })
        }
      }
    })
  })
}