import chalk from 'chalk'
import util from 'util'
import env from 'src/lib/env.js'

// disable colors for production logs, since dokku and sentry choke on them
chalk.enabled = env.NODE_ENV !== 'production'

const LEVELS = [
  'error', // 0
  'warn', // 1
  'info', // 2
  'verbose', // 3
  'debug', // 4
  'silly', // 5
]

const ERROR = LEVELS.indexOf('error')
const WARN = LEVELS.indexOf('warn')
const INFO = LEVELS.indexOf('info')
const VERBOSE = LEVELS.indexOf('verbose')

// quiet logs in test environment
const defaultLevel = env.NODE_ENV === 'test' ? 'error' : 'info'

const LOG_LEVEL = LEVELS.indexOf(env.LOG_LEVEL || defaultLevel)

const colors = [chalk.blue, chalk.cyan, chalk.cyanBright, chalk.yellow]

const errColor = chalk.red

const hash = (channel) =>
  channel
    .split('')
    .map((c) => c.charCodeAt(0))
    .reduce((a, b) => a + b)

// TODO - scrub passwords, api tokens, etc
export default (channel, providedColor = false) => {
  const color = providedColor || colors[hash(channel) % colors.length]
  const logFn = (...args) => {
    const msg = color(util.format(`[${channel}]`, ...args))
    LOG_LEVEL >= VERBOSE && console.log(msg)
  }
  logFn.verbose = logFn
  logFn.info = (...args) => {
    const msg = color(util.format(`[${channel}]`, ...args))
    LOG_LEVEL >= INFO && console.log(msg)
  }
  logFn.error = (...args) => {
    const msg = errColor(
      util.format(chalk.inverse(`[${channel} error]`), ...args),
    )
    LOG_LEVEL >= ERROR && console.error(msg)
  }
  logFn.warn = (...args) => {
    const msg = errColor.dim(util.format(`[${channel} warn]`, ...args))
    LOG_LEVEL >= WARN && console.log(msg)
  }
  return logFn
}
