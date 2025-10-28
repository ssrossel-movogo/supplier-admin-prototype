"use server"

const VALID_API_KEY = "Mv0g0Supp1!3r@dm!n2024$ecur3"

export async function verifyApiKey(apiKey: string): Promise<boolean> {
  return apiKey === VALID_API_KEY
}
