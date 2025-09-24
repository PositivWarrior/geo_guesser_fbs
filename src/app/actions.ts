'use server';
import { shouldPauseTimer } from '@/ai/flows/dynamic-challenge-timer-control';

export async function checkPauseAbility(isChallengeMode: boolean) {
  try {
    const result = await shouldPauseTimer({ challengeEnabled: isChallengeMode });
    return result;
  } catch (error) {
    console.error("AI flow error:", error);
    // In case of an AI error, default to allowing the pause to not disrupt the user experience.
    return { pauseTimer: true };
  }
}
