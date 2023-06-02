const mongoose = require('mongoose')
const { protocol } = require('../utils/constants')
const Schema = mongoose.Schema

const urlCheckSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    url: {
      type: String,
      required: true,
      trim: true,
    },
    protocol: {
      type: String,
      required: true,
      trim: true,
      enum: Object.keys(protocol),
    },
    path: {
      type: String,
      trim: true,
    },
    port: {
      type: Number,
    },
    webhook: {
      type: String,
      required: false,
      trim: true,
    },
    timeout: {
      type: Number,
      default: 5000,
    },
    interval: {
      type: Number,
      default: 600000,
    },
    threshold: {
      type: Number,
      default: 1,
    },
    authentication: {
      type: String,
      trim: true,
    },
    httpHeaders: {
      type: [String],
    },
    assert: {
      type: Number,
    },
    tags: {
      type: [Number],
    },
    ignoreSSL: {
      type: Boolean,
      default: false,
    },
    report: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Report',
      autopopulate: true,
    },
  },
  {
    timestamps: true,
  },
)

// Auto populate plugin
urlCheckSchema.plugin(require('mongoose-autopopulate'))

const UrlCheck = mongoose.model('UrlCheck', urlCheckSchema)

module.exports = UrlCheck
