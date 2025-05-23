import { ICreateAccount, IResetPassword } from '../interfaces/emailTemplate'

const createAccount = (values: ICreateAccount) => {
  console.log(values, 'values')
  const data = {
    to: values.email,
    subject: `Verify your account, ${values.name}`,
    html: `
    <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0;">
      <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.05);">
        <tr>
          <td align="center" style="padding: 40px 0;">
            <img src="https://i.ibb.co/Zj6ZSsj/logo-8dc9b296.png" alt="Logo" style="width: 150px; height: auto;">
          </td>
        </tr>
        <tr>
          <td style="padding: 20px 40px;">
            <h1 style="color: #032237; font-size: 24px; margin-bottom: 20px;">Email Verification</h1>
            <p style="color: #666666; font-size: 16px; line-height: 1.5;">Your verification code is:</p>
            <div style="background-color: #f0f0f0; border-radius: 4px; padding: 15px; margin: 20px 0; text-align: center;">
              <span style="font-size: 32px; font-weight: bold; color: #032237;">${values.otp}</span>
            </div>
            <p style="color: #666666; font-size: 16px; line-height: 1.5;">This code will expire in 5 minutes. If you didn't request this code, please ignore this email.</p>
          </td>
        </tr>
        <tr>
          <td style="padding: 20px 40px; text-align: center; color: #999999; font-size: 14px;">
            <p>&copy; ${new Date().getFullYear()} Healthcare Consultants. All rights reserved.</p>
          </td>
        </tr>
      </table>
    </body>
  `,
  }
  return data
}

const resetPassword = (values: IResetPassword) => {
  const data = {
    to: values.email,
    subject: `Reset your password, ${values.name}`,
    html: `
    <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0;">
      <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.05);">
        <tr>
          <td align="center" style="padding: 40px 0;">
            <img src="https://i.ibb.co/Zj6ZSsj/logo-8dc9b296.png" alt="Logo" style="width: 150px; height: auto;">
          </td>
        </tr>
        <tr>
          <td style="padding: 20px 40px;">
            <h1 style="color: #032237; font-size: 24px; margin-bottom: 20px;">Password Reset</h1>
            <p style="color: #666666; font-size: 16px; line-height: 1.5;">Your password reset code is:</p>
            <div style="background-color: #f0f0f0; border-radius: 4px; padding: 15px; margin: 20px 0; text-align: center;">
              <span style="font-size: 32px; font-weight: bold; color: #032237;">${values.otp}</span>
            </div>
            <p style="color: #666666; font-size: 16px; line-height: 1.5;">This code will expire in 5 minutes. If you didn't request this code, please ignore this email.</p>
          </td>
        </tr>
        <tr>
          <td style="padding: 20px 40px; text-align: center; color: #999999; font-size: 14px;">
            <p>&copy; ${new Date().getFullYear()} Healthcare Consultants. All rights reserved.</p>
          </td>
        </tr>
      </table>
    </body>
  `,
  }
  return data
}

const resendOtp = (values: {
  email: string
  name: string
  otp: string
  type: 'reset' | 'verify'
}) => {
  const isReset = values.type === 'reset'
  const data = {
    to: values.email,
    subject: `${isReset ? 'Password Reset' : 'Account Verification'} - New Code`,
    html: `
    <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0;">
      <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.05);">
        <tr>
          <td align="center" style="padding: 40px 0;">
            <img src="https://i.ibb.co/Zj6ZSsj/logo-8dc9b296.png" alt="Logo" style="width: 150px; height: auto;">
          </td>
        </tr>
        <tr>
          <td style="padding: 20px 40px;">
            <h1 style="color: #032237; font-size: 24px; margin-bottom: 20px;">New Verification Code</h1>
            <p style="color: #666666; font-size: 16px; line-height: 1.5;">
              Hello ${values.name},<br><br>
              You requested a new ${isReset ? 'password reset' : 'verification'} code. Here's your new code:
            </p>
            <div style="background-color: #f0f0f0; border-radius: 4px; padding: 15px; margin: 20px 0; text-align: center;">
              <span style="font-size: 32px; font-weight: bold; color: #032237;">${values.otp}</span>
            </div>
            <p style="color: #666666; font-size: 16px; line-height: 1.5;">
              This code will expire in 5 minutes.<br>
              If you didn't request this code, please ignore this email or contact support.
            </p>
            <div style="margin-top: 30px; padding: 15px; background-color: #e6eaed; border-radius: 4px; border-left: 4px solid #032237;">
              <p style="color: #666666; font-size: 14px; margin: 0;">
                For security reasons, never share this code with anyone.
              </p>
            </div>
          </td>
        </tr>
        <tr>
          <td style="padding: 20px 40px; text-align: center; color: #999999; font-size: 14px; border-top: 1px solid #eeeeee;">
            <p>&copy; ${new Date().getFullYear()} Healthcare Consultants. All rights reserved.</p>
          </td>
        </tr>
      </table>
    </body>
  `,
  }
  return data
}

const bookingConfirmation = (values: {
  email: string
  name: string
  date: string
  time: string
  service: string
  meetingLink: string
  meetingPassword: string
  meetingId: string
}) => {
  const data = {
    to: values.email,
    subject: `Your Healthcare Consultation Booking Confirmation`,
    html: `
    <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0;">
      <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.05);">
        <tr>
          <td align="center" style="padding: 40px 0;">
            <img src="https://i.ibb.co/Zj6ZSsj/logo-8dc9b296.png" alt="Logo" style="width: 150px; height: auto;">
          </td>
        </tr>
        <tr>
          <td style="padding: 20px 40px;">
            <h1 style="color: #032237; font-size: 24px; margin-bottom: 20px;">Booking Confirmation</h1>
            <p style="color: #666666; font-size: 16px; line-height: 1.5;">Hello ${values.name},</p>
            <p style="color: #666666; font-size: 16px; line-height: 1.5;">Your healthcare consultation has been confirmed for:</p>
            
            <div style="background-color: #f0f0f0; border-radius: 4px; padding: 20px; margin: 20px 0;">
              <p style="margin: 5px 0; font-size: 16px;"><strong>Service:</strong> ${values.service}</p>
              <p style="margin: 5px 0; font-size: 16px;"><strong>Date:</strong> ${values.date}</p>
              <p style="margin: 5px 0; font-size: 16px;"><strong>Time:</strong> ${values.time}</p>
            </div>
            
            <h2 style="color: #032237; font-size: 20px; margin: 25px 0 15px 0;">Zoom Meeting Details</h2>
            <div style="background-color: #e6eaed; border-radius: 4px; padding: 20px; margin: 20px 0; border-left: 4px solid #032237;">
              <p style="margin: 5px 0; font-size: 16px;"><strong>Meeting ID:</strong> ${values.meetingId}</p>
              <p style="margin: 5px 0; font-size: 16px;"><strong>Password:</strong> ${values.meetingPassword}</p>
              <a href="${values.meetingLink}" style="display: inline-block; margin-top: 15px; background-color: #032237; color: white; padding: 12px 25px; text-decoration: none; border-radius: 4px; font-weight: bold;">Join Meeting</a>
            </div>
            
            <p style="color: #666666; font-size: 16px; line-height: 1.5;">Please join the meeting 5 minutes before the scheduled time. If you need to reschedule, please contact us as soon as possible.</p>
            
            <div style="margin-top: 30px; padding: 15px; background-color: #e6eaed; border-radius: 4px; border-left: 4px solid #032237;">
              <p style="color: #666666; font-size: 14px; margin: 0;">
                For any questions or assistance, please reply to this email or contact our support team.
              </p>
            </div>
          </td>
        </tr>
        <tr>
          <td style="padding: 20px 40px; text-align: center; color: #999999; font-size: 14px; border-top: 1px solid #eeeeee;">
            <p>&copy; ${new Date().getFullYear()} Healthcare Consultants. All rights reserved.</p>
          </td>
        </tr>
      </table>
    </body>
  `,
  }
  return data
}

const bookingRescheduled = (values: {
  email: string
  name: string
  date: string
  time: string
  service: string
  meetingLink: string
  meetingPassword: string
  meetingId: string
}) => {
  const data = {
    to: values.email,
    subject: `Your Healthcare Consultation Has Been Rescheduled`,
    html: `
    <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0;">
      <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.05);">
        <tr>
          <td align="center" style="padding: 40px 0;">
            <img src="https://i.ibb.co/Zj6ZSsj/logo-8dc9b296.png" alt="Logo" style="width: 150px; height: auto;">
          </td>
        </tr>
        <tr>
          <td style="padding: 20px 40px;">
            <h1 style="color: #032237; font-size: 24px; margin-bottom: 20px;">Booking Rescheduled</h1>
            <p style="color: #666666; font-size: 16px; line-height: 1.5;">Hello ${values.name},</p>
            <p style="color: #666666; font-size: 16px; line-height: 1.5;">Your healthcare consultation has been rescheduled to:</p>
            
            <div style="background-color: #f0f0f0; border-radius: 4px; padding: 20px; margin: 20px 0;">
              <p style="margin: 5px 0; font-size: 16px;"><strong>Service:</strong> ${values.service}</p>
              <p style="margin: 5px 0; font-size: 16px;"><strong>New Date:</strong> ${values.date}</p>
              <p style="margin: 5px 0; font-size: 16px;"><strong>New Time:</strong> ${values.time}</p>
            </div>
            
            <h2 style="color: #032237; font-size: 20px; margin: 25px 0 15px 0;">Updated Zoom Meeting Details</h2>
            <div style="background-color: #e6eaed; border-radius: 4px; padding: 20px; margin: 20px 0; border-left: 4px solid #032237;">
              <p style="margin: 5px 0; font-size: 16px;"><strong>Meeting ID:</strong> ${values.meetingId}</p>
              <p style="margin: 5px 0; font-size: 16px;"><strong>Password:</strong> ${values.meetingPassword}</p>
              <a href="${values.meetingLink}" style="display: inline-block; margin-top: 15px; background-color: #032237; color: white; padding: 12px 25px; text-decoration: none; border-radius: 4px; font-weight: bold;">Join Meeting</a>
            </div>
            
            <p style="color: #666666; font-size: 16px; line-height: 1.5;"><strong>Important:</strong> Please note that the previous meeting link is no longer valid. Use the new link provided above to join your consultation.</p>
            
            <div style="margin-top: 30px; padding: 15px; background-color: #e6eaed; border-radius: 4px; border-left: 4px solid #032237;">
              <p style="color: #666666; font-size: 14px; margin: 0;">
                If you did not request this change or have any questions, please contact our support team immediately.
              </p>
            </div>
          </td>
        </tr>
        <tr>
          <td style="padding: 20px 40px; text-align: center; color: #999999; font-size: 14px; border-top: 1px solid #eeeeee;">
            <p>&copy; ${new Date().getFullYear()} Healthcare Consultants. All rights reserved.</p>
          </td>
        </tr>
      </table>
    </body>
  `,
  }
  return data
}

export const emailTemplate = {
  createAccount,
  resetPassword,
  resendOtp,
  bookingConfirmation,
  bookingRescheduled,
}
