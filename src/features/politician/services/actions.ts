'use server';

import { fraudDetectionAI } from '@/ai/flows/fraud-detection-ai';

export async function analyzeRedemption(redemptionData: string) {
  if (!redemptionData) {
    return { error: 'Redemption data cannot be empty.' };
  }

  try {
    // Validate if the input is a valid JSON
    JSON.parse(redemptionData);
  } catch (e) {
    return { error: 'Invalid JSON format. Please check your input.' };
  }

  try {
    const result = await fraudDetectionAI({ redemptionData });
    return { data: result };
  } catch (error) {
    console.error('Error calling fraudDetectionAI:', error);
    return { error: 'An unexpected error occurred during analysis.' };
  }
}
