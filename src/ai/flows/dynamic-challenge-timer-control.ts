'use server';

/**
 * @fileOverview Determines whether the timer should be pausable based on challenge configurations.
 *
 * - shouldPauseTimer - A function that determines if the timer should be pausable.
 * - ShouldPauseTimerInput - The input type for the shouldPauseTimer function.
 * - ShouldPauseTimerOutput - The return type for the shouldPauseTimer function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ShouldPauseTimerInputSchema = z.object({
  challengeEnabled: z.boolean().describe('Whether challenges are enabled.'),
});
export type ShouldPauseTimerInput = z.infer<typeof ShouldPauseTimerInputSchema>;

const ShouldPauseTimerOutputSchema = z.object({
  pauseTimer: z.boolean().describe('Whether the timer should be pausable.'),
});
export type ShouldPauseTimerOutput = z.infer<typeof ShouldPauseTimerOutputSchema>;

export async function shouldPauseTimer(input: ShouldPauseTimerInput): Promise<ShouldPauseTimerOutput> {
  return shouldPauseTimerFlow(input);
}

const prompt = ai.definePrompt({
  name: 'shouldPauseTimerPrompt',
  input: {schema: ShouldPauseTimerInputSchema},
  output: {schema: ShouldPauseTimerOutputSchema},
  prompt: `You are an expert game configuration specialist.

You will determine, given the current configuration, whether the pause timer should be enabled.

If challenges are enabled, then the timer should not be pausable, to maintain a fair playing field.

Challenges Enabled: {{{challengeEnabled}}}

Based on this information, determine whether the timer should be pausable. If challenges are enabled, then it should not be pausable, so return false. Otherwise, return true.
`,
});

const shouldPauseTimerFlow = ai.defineFlow(
  {
    name: 'shouldPauseTimerFlow',
    inputSchema: ShouldPauseTimerInputSchema,
    outputSchema: ShouldPauseTimerOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
