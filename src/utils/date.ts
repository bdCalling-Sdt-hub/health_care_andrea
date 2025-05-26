import { DateTime } from 'luxon'
import { ISchedule } from '../app/modules/user/user.interface'
import ApiError from '../errors/ApiError'
import { StatusCodes } from 'http-status-codes'

export const convertSlotTimeToUTC = (slot: string, timeZone: string) => {
  const localTime = DateTime.fromFormat(slot, 'h:mm a', {
    zone: timeZone || 'America/New_York',
  })
  const utcTime = localTime.toUTC()

  const timeCode = utcTime.hour * 100 + utcTime.minute

  return { timeCode, time: utcTime.toFormat('h:mm a') }
}

export const formatSchedule = (schedule: ISchedule, timeZone: string) => {
  const formattedSchedule = schedule.schedule.map(daySchedule => {
    const formattedTimes = daySchedule.times.map((timeString: any) => {
      const localTime = DateTime.fromFormat(timeString, 'h:mm a', {
        zone: timeZone,
      })
      console.log(localTime)

      if (!localTime.isValid) {
        console.error(
          `Failed to parse time: ${timeString} with timezone: ${timeZone}`,
        )
        throw new ApiError(
          StatusCodes.BAD_REQUEST,
          `Invalid time format: ${timeString}`,
        )
      }

      const utcTime = localTime.toUTC()
      const timeCode = utcTime.hour * 100 + utcTime.minute

      if (isNaN(timeCode)) {
        console.error(`Invalid timeCode generated for ${timeString}`)
        throw new ApiError(
          StatusCodes.BAD_REQUEST,
          `Failed to generate valid timeCode for ${timeString}`,
        )
      }

      return {
        time: utcTime.toFormat('hh:mm a'),
        timeCode,
      }
    })

    return {
      day: daySchedule.day,
      times: formattedTimes,
    }
  })

  return formattedSchedule
}

export function convertScheduleToLocal(
  scheduleData: ISchedule,
  userTimeZone: string,
) {
  console.log('Converting schedule to timezone:', userTimeZone)
  console.log('Original schedule timezone:', scheduleData.timeZone)
  return scheduleData.schedule.map(daySchedule => ({
    ...daySchedule,
    times: daySchedule.times.map(timeSlot => {
      // Parse the UTC time (stored time is in UTC)
      //@ts-ignore
      const [hour, minute] = timeSlot.timeCode
        .toString()
        .padStart(4, '0')
        .match(/.{1,2}/g)

      const utcTime = DateTime.utc().set({
        hour: parseInt(hour),
        minute: parseInt(minute),
        second: 0,
        millisecond: 0,
      })

      // Convert to user's timezone
      const localTime = utcTime.setZone(userTimeZone)
      // Format back to 12-hour time string
      const formattedTime = localTime.toFormat('hh:mm a').toUpperCase()

      return {
        ...timeSlot,
        time: formattedTime,
      }
    }),
  }))
}

export const convertSessionTimeToUTC = (
  slot: string,
  timeZone: string,
  referenceDate?: string,
) => {
  // Combine with reference date if provided
  const dateTimeString = referenceDate ? `${referenceDate} ${slot}` : slot

  const localTime = DateTime.fromFormat(dateTimeString, 'yyyy-MM-dd h:mm a', {
    zone: timeZone,
  })
  if (!localTime.isValid) {
    throw new Error(`Invalid time format: ${slot} for timezone ${timeZone}`)
  }

  const utcTime = localTime.toUTC()
  return {
    timeCode: utcTime.hour * 100 + utcTime.minute,
    time: utcTime.toFormat('h:mm a'),
    isoString: utcTime.toISO(), // Return full ISO string
  }
}

// Add this new function to your date.ts file
export const convertSessionTimeToLocalISO = (time: Date, timeZone: string) => {
  // 1. Get the UTC time from MongoDB
  const utcTime = DateTime.fromJSDate(time).toUTC()

  // 2. Convert to specified timezone
  const localTime = utcTime.setZone(timeZone)

  // 3. Return ISO string for Zoom API
  return localTime.toISO()
}
export const convertSessionTimeToLocal = (time: Date, timeZone: string) => {
  // 1. Get the UTC time from MongoDB
  const utcTime = DateTime.fromJSDate(time).toUTC()

  // 2. Convert to user's timezone
  const userLocalTime = utcTime.setZone(timeZone)

  // 3. Format for display
  return userLocalTime.toFormat('yyyy-MM-dd h:mm a')
}
