import ssg from '@hono/vite-ssg'
import honox from 'honox/vite'
import client from 'honox/vite/client'
import { defineConfig } from 'vite'

const entry = './app/server.ts'

export default defineConfig(({ mode }) => {
  if (mode === 'client') {
    return {
      plugins: [client()]
    }
  } else {
    return {
      build: {
        outDir: 'docs',
        emptyOutDir: false,
      },
      plugins: [honox(), ssg({ entry })],
    }
  }
})
