module.exports = function (api) {
  api.cache(true)

  const presets = [
    [
      '@babel/preset-env',
      {
        targets: {
          node: '14',
        },
      },
    ],
  ]
  const plugins = []

  return {
    presets,
    plugins,
  }
}
