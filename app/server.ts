import { showRoutes } from 'hono/dev'
import { createApp } from 'honox/server'
import { serveStatic } from '@hono/node-server/serve-static'

const app = createApp()
app.use('/*', serveStatic({ root: './public' }))

showRoutes(app)

export default app
