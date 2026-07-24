import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectDB from '@/lib/db';

export async function GET() {
  try {
    await connectDB();

    const { host, port, name, readyState } = mongoose.connection;

    const stateMap: Record<number, string> = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting',
    };

    const collections = await mongoose.connection.db.listCollections().toArray();
    const collectionNames = collections.map((c) => c.name);

    return NextResponse.json({
      connected: readyState === 1,
      readyState: `${readyState} (${stateMap[readyState] || 'unknown'})`,
      database: name,
      host: `${host}:${port}`,
      collections: collectionNames,
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        connected: false,
        error: err?.message || 'Unknown error',
        errorName: err?.name,
        errorCode: err?.code,
      },
      { status: 500 }
    );
  }
}
