"use server"

const VALID_API_KEY = "movoit"

export async function verifyApiKey(apiKey: string): Promise<boolean> {
  return apiKey === VALID_API_KEY
}
