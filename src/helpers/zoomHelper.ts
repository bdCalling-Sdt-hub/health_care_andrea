import axios from 'axios'
import config from '../config'
import { DateTime } from 'luxon'

// Base URL for Zoom API
const ZOOM_API_BASE_URL = 'https://api.zoom.us/v2'

// Token cache
let tokenCache = {
  accessToken: '',
  expiresAt: 0,
}

// Get Zoom OAuth token with caching
const getZoomToken = async () => {
  // Check if we have a valid cached token
  const now = Date.now()
  if (tokenCache.accessToken && tokenCache.expiresAt > now) {
    return tokenCache.accessToken
  }

  try {
    // Get credentials from config or environment variables
    const accountId = config.zoom?.accountId
    const clientId = config.zoom?.clientId
    const clientSecret = config.zoom?.clientSecret

    if (!accountId || !clientId || !clientSecret) {
      throw new Error(
        'Missing Zoom API credentials. Please check your environment variables or config.',
      )
    }

    const response = await axios.post('https://zoom.us/oauth/token', null, {
      params: {
        grant_type: 'account_credentials',
        account_id: accountId,
        scope: 'meeting:write:meeting meeting:write:meeting:admin',
      },
      headers: {
        Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })

    // Cache the token with expiration (subtract 5 minutes for safety margin)
    const expiresIn = response.data.expires_in || 3600
    tokenCache = {
      accessToken: response.data.access_token,
      expiresAt: now + (expiresIn - 300) * 1000,
    }

    return response.data.access_token
  } catch (error) {
    console.error('Error getting Zoom token:', error)
    throw new Error('Failed to get Zoom access token')
  }
}

// Create a Zoom meeting
export const createZoomMeeting = async (
  topic: string,
  startTime: string,
  duration: number = 60,
  timezone: string = 'UTC',
) => {
  try {
    const token = await getZoomToken()

    const response = await axios.post(
      `${ZOOM_API_BASE_URL}/users/me/meetings`,
      {
        topic,
        type: 2, // Scheduled meeting
        start_time: startTime, // Use the original ISO string with timezone
        duration,
        timezone: timezone || 'America/Los_Angeles', // Keep the timezone parameter
        settings: {
          host_video: true,
          participant_video: true,
          join_before_host: false,
          mute_upon_entry: true,
          auto_recording: 'none',
          waiting_room: true,
          meeting_authentication: true,
          password: true,
          private_meeting: true,
          waiting_room_options: {
            enable: true,
            auto_admit: false,
          },
          join_before_host_time: 0, // Don't allow joining before host (in minutes)
        },
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      },
    )

    // Import the DateTime from luxon at the top of the file if not already imported
    // import { DateTime } from 'luxon'

    // Convert the UTC meeting time to the admin's timezone
    const utcMeetingTime = DateTime.fromISO(response.data.start_time).toUTC()
    const localMeetingTime = utcMeetingTime.setZone(timezone).toJSDate()

    return {
      meetingId: response.data.id,
      joinUrl: response.data.join_url,
      startUrl: response.data.start_url,
      password: response.data.password,
      meetingTime: localMeetingTime, // Store as a Date object in the admin's timezone
    }
  } catch (error) {
    console.error(
      'Error creating Zoom meeting:',
      (error as any).response?.data || error,
    )
    throw new Error('Failed to create Zoom meeting')
  }
}
