import type { User } from 'firebase/auth'
import { message } from 'antd'

/**
 * Gets a fresh Firebase ID token for the authenticated user
 * @param user - Firebase User object
 * @param showError - Whether to show error message to user (default: true)
 * @returns Promise<string | null> - ID token or null if failed
 */
export const getIdToken = async (
  user: User | null,
  showError: boolean = true
): Promise<string | null> => {
  if (!user) {
    if (showError) {
      message.error('User not authenticated')
    }
    return null
  }

  try {
    // forceRefresh: false = use cached token if valid, refresh if expired
    const token = await user.getIdToken(false)
    return token
  } catch (error: unknown) {
    if (showError) {
      if (error instanceof Error) {
        message.error(`Authentication failed: ${error.message}`)
      } else {
        message.error('Failed to get authentication token')
      }
    }
    return null
  }
}
