const mongoose = require('mongoose')
const Schema = mongoose.Schema

const reportSchema = new Schema(
  {
    status: {
      type: String,
      required: true,
      trim: true,
    },
    availability: {
      type: String,
      required: true,
      trim: true,
    },
    outages: {
      type: Number,
      required: true,
    },
    downtime: {
      type: Number,
      required: true,
    },
    uptime: {
      type: Number,
      required: true,
    },
    responseTime: {
      type: Number,
      required: true,
    },
    history: {
      type: [
        {
          status: String,
          responseTime: String,
          timestamp: {
            type: Date,
            default: Date.now(),
          },
        },
        { timestamps: true },
      ],
      required: true,
    },
  },
  {
    timestamps: true,
  },
)

// Auto populate plugin
reportSchema.plugin(require('mongoose-autopopulate'))

const Report = mongoose.model('Report', reportSchema)

module.exports = Report
