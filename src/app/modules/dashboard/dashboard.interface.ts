import { Model, Schema, model } from 'mongoose'

export interface IGeneralStatistics {
  totalRevenue: number
  totalClients: number
  pendingApplications: number
  completedConsultations: number
}

export interface IServiceAnalytics {
  _id: string
  serviceName: string
  count: number
  percentage: number
}

export interface IBookingStatistics {
  pendingRate: number
  completedRate: number
  cancelledRate: number
  totalBookings: number
}

export interface IMonthlyRevenue {
  month: number
  revenue: number
}

export interface IChartData {
  name: string
  value: number
}
export interface IChart {
  _id: string
  title: string
  description: string
  data: IChartData[]
  type: string
  createdAt: Date
  updatedAt: Date
}

export type ChartModel = Model<IChart>

const chartSchema = new Schema<IChart>(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['graph', 'bar', 'pie'],
      required: true,
    },
    data: [
      {
        _id: false,
        name: String,
        value: Number,
      },
    ],
  },
  { timestamps: true },
)

export const Chart = model<IChart>('Chart', chartSchema)

export interface IRevenueCalculation {
  monthlyRevenue: IMonthlyRevenue[]
  totalRevenue: number
}
