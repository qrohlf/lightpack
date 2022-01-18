import onHeaders from 'on-headers'
import log from 'src/lib/log.js'
import perftime from 'src/lib/perftime.js'
import chalk from 'chalk'

const httpLog = log('HTTP')

export default (req, res, next) => {
  const time = perftime()
  onHeaders(res, () => {
    const ms = time()
    const userFmt = req.user
      ? chalk.dim(`authenticated as (${req.user.id}/${req.user.email})`)
      : ''
    res.statusCode < 400
      ? httpLog.info(
          `(${ms}ms)`,
          res.statusCode,
          req.method,
          req.originalUrl,
          userFmt,
        )
      : httpLog.warn(
          `(${ms}ms)`,
          res.statusCode,
          req.method,
          req.originalUrl,
          userFmt,
        )
  })
  next()
}
