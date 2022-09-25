import * as process from 'process'
import execute from '../execute'
import logger from '../utils/logging'

(async() => {
  try {
    await execute()
  } catch (err) {
    logger.error(`Processing failed: ${err}`)
    process.exit(1)
  }
})()
