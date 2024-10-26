import { openai } from '@ai-sdk/openai';
import { convertToCoreMessages, streamText } from 'ai';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    // Hardcoded message prompt
    const messages = [
      {
        role: 'user' as 'user',
        content: "Create a list of 3 questions to ask in social media for anonymous feedback. Each question should be separated by ||."
      }
    ];

    // Convert the hardcoded messages to the required format for the API
    const formattedMessages = convertToCoreMessages(messages);

    // Stream response from GPT-4
    const result = await streamText({
      model: openai('gpt-4o'),
      messages: formattedMessages,
    });

    // Return the streaming response
    return result.toDataStreamResponse();

  } catch (error) {
    // Handle errors and return a 500 status with a message
    console.error('Error in POST handler:', error);
    return new Response(
      JSON.stringify({ error: 'An error occurred while processing the request.' }),
      { status: 500 }
    );
  }
}
