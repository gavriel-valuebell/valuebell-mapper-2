import { message } from 'antd'

/**
 * Regular expression matching RTL (Right-to-Left) Unicode character ranges:
 * - Hebrew: \u0590-\u05FF
 * - Arabic: \u0600-\u06FF
 * - Arabic Supplement: \u0750-\u077F
 * - Arabic Extended-A: \u08A0-\u08FF
 */
const RTL_CHARS_REGEX = /[\u0590-\u05FF\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/

/**
 * Detects if the provided text contains RTL characters
 * @param text - The text to analyze
 * @returns true if RTL characters are detected, false otherwise
 */
export const detectIsRtl = (text: string): boolean => RTL_CHARS_REGEX.test(text)

/**
 * Copies text to the clipboard and shows a success/error message
 * @param text - The text to copy
 * @param successMessage - Message to display on successful copy
 * @returns Promise that resolves when copy is complete
 */
export const copyToClipboard = async (text: string, successMessage: string): Promise<void> => {
  try {
    await navigator.clipboard.writeText(text)
    message.success(successMessage)
  } catch {
    message.error('Failed to copy to clipboard')
  }
}
