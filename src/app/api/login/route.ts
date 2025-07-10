// src/app/api/login/route.ts
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();
    // 用户验证逻辑
    if (username != 'root' || password != 'Dgut207207207!') {
      return NextResponse.json(
        { message: 'Invalid credentials' },
        { status: 401 }
      );
    }
    
    
    // 签发token
    const token = jwt.sign(
      { username },
      process.env.JWT_SECRET || 'Dgut-gtcist',
      { expiresIn: '1h' }
    );
    
    const response = NextResponse.json({ token }, { status: 200 });
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'POST');
    
    return response;
  } catch (error) {
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

