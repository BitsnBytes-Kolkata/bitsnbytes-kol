import { NextResponse } from 'next/server';

export function GET() {
  return NextResponse.redirect('https://perfect-dinghy-781.notion.site/33a49ed2fc33800984e7c28ca3d7cd2a?pvs=105');
}

export const dynamic = 'force-static';
