import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    // 1. Simulates a 4-second delay while the frontend shows "Generating your 60 portraits..."
    await new Promise((resolve) => setTimeout(resolve, 4000));

    // 2. Creates an array of 60 high-quality professional portrait links from Unsplash
    const mockOutputImages = Array.from({ length: 60 }, (_, index) => {
      const photoIds = [
        '1534528741775-53994a69daeb', 
        '1507003211169-0a1dd7228f2d', 
        '1494790108377-be9c29b29330', 
        '1500648767791-00dcc994a43e'
      ];
      const id = photoIds[index % photoIds.length];
      return `https://images.unsplash.com/photo-${id}?w=500&auto=format&fit=crop&q=80&sig=${index}`;
    });

    // 3. Returns the array so your frontend layout grid can display them perfectly
    return NextResponse.json({ 
      success: true, 
      images: mockOutputImages 
    });

  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
