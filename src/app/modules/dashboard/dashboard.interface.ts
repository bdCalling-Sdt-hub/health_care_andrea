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

export interface IRevenueCalculation {
  monthlyRevenue: IMonthlyRevenue[]
  totalRevenue: number
}
