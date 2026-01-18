import { sendDailyNewsSummary } from '@/lib/inngest/functions';

export async function GET() {
  try {
    // Manually trigger the function for testing
    const result = await (sendDailyNewsSummary as any).trigger();
    
    return Response.json({
      success: true,
      message: 'News summary function triggered',
      result
    });
  } catch (error) {
    console.error('Error triggering news summary:', error);
    return Response.json({
      success: false,
      error: String(error)
    }, { status: 500 });
  }
}
