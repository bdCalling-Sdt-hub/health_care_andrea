export type ICreateAccount = {
  name: string
  email: string
  otp: string
}

export type IResetPassword = {
  name: string
  email: string
  otp: string
}

export type IEmailOrPhoneVerification = {
  name: string
  email?: string
  phone?: string
  type: 'createAccount' | 'resetPassword'
}

export type IBookingEmail = {
  email: string
  name: string
  date: string
  time: string
  service: string
  meetingLink: string
  meetingPassword: string
  meetingId: string
}
