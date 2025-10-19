import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Supabase client (Service Role Key)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Keycloak userId is a string UUID
interface KeycloakWebhookPayload {
  type: string;
  realmId: string;
  clientId: string;
  userId: string; // <-- This is the Keycloak user ID (UUID)
  ipAddress: string;
  details: {
    username?: string;
    email?: string;
    first_name?: string;
    last_name?: string;
    [key: string]: any;
  };
  time: number;
}

export async function POST(request: NextRequest) {
  try {
    // 1️⃣ AUTH CHECK
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Basic ')) {
      return NextResponse.json(
        { error: 'Unauthorized - Missing or invalid authorization header' },
        { status: 401 }
      );
    }

    const base64Credentials = authHeader.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString(
      'utf-8'
    );
    const [username, password] = credentials.split(':');

    const expectedUsername = process.env.WEBHOOK_AUTH_USERNAME;
    const expectedPassword = process.env.WEBHOOK_AUTH_PASSWORD;

    if (username !== expectedUsername || password !== expectedPassword) {
      return NextResponse.json(
        { error: 'Unauthorized - Invalid credentials' },
        { status: 401 }
      );
    }

    // 2️⃣ PARSE PAYLOAD
    const payload: KeycloakWebhookPayload = await request.json();
    console.log('🔔 Received Keycloak webhook:', {
      type: payload.type,
      keycloakUserId: payload.userId, // Renamed for clarity
      email: payload.details.email,
    });

    if (payload.type !== 'REGISTER') {
      return NextResponse.json({
        message: 'Event ignored',
        type: payload.type,
      });
    }

    // Ensure we have the necessary data from Keycloak
    if (
      !payload.userId ||
      !payload.details.email ||
      !payload.details.username
    ) {
      return NextResponse.json(
        { error: 'Missing required fields: userId, email, or username' },
        { status: 400 }
      );
    }

    // 3️⃣ CHUẨN BỊ USER PROFILE
    // We use Keycloak's 'userId' as the primary key 'id' in the 'profiles' table.
    // This replaces the step of querying 'auth.users'.

    console.log(
      '🔄 Preparing user profile for upsert with Keycloak ID:',
      payload
    );

    const userProfile = {
      keycloak_id: payload.userId, // <-- Use the Keycloak 'userId' directly
      username: payload.details.username,
      first_name: payload.details.first_name || null,
      last_name: payload.details.last_name || null,
      email: payload.details.email,
      // Add other fields as needed, e.g., 'keycloak_realm_id: payload.realmId'
    };

    // 4️⃣ UPSERT VÀO profiles
    const { data, error } = await supabase
      .from('profiles')
      .upsert(userProfile, {
        onConflict: 'keycloak_id', // Conflict resolution on the Keycloak user ID
        ignoreDuplicates: false,
      })
      .select();

    if (error) {
      console.error('❌ Supabase insert error:', error);
      return NextResponse.json(
        { error: 'Failed to sync profile to Supabase', details: error.message },
        { status: 500 }
      );
    }

    console.log('✅ Profile synchronized successfully:', data);

    return NextResponse.json({
      success: true,
      message: 'User profile synchronized to Supabase',
      data,
    });
  } catch (error) {
    console.error('🔥 Error processing webhook:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// Optional: Health check
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    service: 'keycloak-webhook-handler',
    timestamp: new Date().toISOString(),
  });
}
