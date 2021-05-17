import { Express } from "express"
import { userRouter } from "./users.route"
import { teamRouter } from "./teams.route"

export function buildRoutes(app: Express) {
  app.use('/users', userRouter)
  app.use('/teams', teamRouter)
}