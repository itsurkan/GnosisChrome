'use server';

/**
 * @fileOverview This file defines a Genkit flow for analyzing user chat queries and suggesting relevant document chunks to inject into the query.
 *
 * - injectAiQuery - A function that handles the process of analyzing the query and suggesting document chunks.
 * - InjectAiQueryInput - The input type for the injectAiQuery function.
 * - InjectAiQueryOutput - The return type for the injectAiQuery function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const InjectAiQueryInputSchema = z.object({
  query: z.string().describe('The current user chat query.'),
  documentChunks: z.array(z.string()).describe('An array of relevant document chunks.'),
});
export type InjectAiQueryInput = z.infer<typeof InjectAiQueryInputSchema>;

const InjectAiQueryOutputSchema = z.object({
  shouldInject: z.boolean().describe('Whether or not the document chunks should be injected into the query.'),
  reason: z.string().describe('The reasoning behind the decision to inject or not inject the document chunks.'),
});
export type InjectAiQueryOutput = z.infer<typeof InjectAiQueryOutputSchema>;

export async function injectAiQuery(input: InjectAiQueryInput): Promise<InjectAiQueryOutput> {
  return injectAiQueryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'injectAiQueryPrompt',
  input: {schema: InjectAiQueryInputSchema},
  output: {schema: InjectAiQueryOutputSchema},
  prompt: `You are an AI assistant that analyzes user chat queries and suggests whether or not relevant document chunks should be injected into the query to provide more informed and relevant responses.

  User Query: {{{query}}}
  Document Chunks: {{{documentChunks}}}

  Based on the user query and the provided document chunks, determine if the document chunks are relevant to the query and would enhance the response from the chat application.

  Return a JSON object with the following format:
  {
    "shouldInject": true/false, // true if the document chunks should be injected, false otherwise
    "reason": "reasoning for the decision" // a brief explanation for the decision
  }`,
});

const injectAiQueryFlow = ai.defineFlow(
  {
    name: 'injectAiQueryFlow',
    inputSchema: InjectAiQueryInputSchema,
    outputSchema: InjectAiQueryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

