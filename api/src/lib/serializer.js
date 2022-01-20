import _ from 'lodash'

const serializer =
  (...operations) =>
  (model) =>
    operations.reduce((json, func) => func(model, json), {})

// copy attrs from model to serializer output
serializer.include =
  (...attrs) =>
  (model, json) =>
    // we don't use lodash pick here because it only operates on enumerable properties
    attrs.reduce((obj, key) => ({ ...obj, [key]: model[key] }), json)

// munge attrs from model to serializer output
serializer.munge = (key, mungeFn) => (model, json) =>
  model[key] !== undefined && model[key] !== null
    ? { ...json, [key]: mungeFn(model[key]) }
    : json

serializer.alias = (key, alias) => (model, json) => ({
  ...json,
  [alias]: _.get(model, key),
})

export default serializer
