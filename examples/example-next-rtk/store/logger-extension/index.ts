import type { Extension } from '@redux-eggs/redux-toolkit'
import type { Middleware } from '@reduxjs/toolkit'

export const getLoggerExtension = (): Extension => {
  const middlewares: Middleware[] = []

  if (process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_USE_LOGGER_EXTENSION === 'true') {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { createLogger } = require('redux-logger')

    middlewares.push(
      createLogger({
        level: {
          action() {
            return 'log'
          },
        },
        collapsed(_getState: any, _action: any, logEntry: any) {
          return !logEntry.error
        },
      }),
    )
  }

  return { middlewares }
}
