import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg'; // ⚠️ Đã thay đổi từ Client sang Pool

// Keycloak userId is a string UUID
interface KeycloakWebhookPayload {
  type: string;
  realmId: string;
  clientId: string;
  userId: string;
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

// 🌐 POSTGRES CONNECTION POOL
// Pool được tạo ra toàn cục (global) vì nó an toàn và hiệu quả hơn.
// Mỗi request sẽ mượn một client từ pool.
const pool = new Pool({
  connectionString: process.env.NEXT_POSTGRES_URI!,
  // Cấu hình tối ưu cho môi trường Serverless:
  max: 20, // Số lượng kết nối tối đa trong pool
  idleTimeoutMillis: 30000, // Đóng kết nối nhàn rỗi sau 30 giây
  connectionTimeoutMillis: 2000, // Timeout khi cố gắng kết nối
});

// Bỏ qua client.connect() toàn cục. Pool sẽ tự quản lý kết nối.

export async function POST(request: NextRequest) {
  // 🔗 Khai báo client để dùng trong hàm, sau đó release
  let dbClient;

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

    if (
      username !== process.env.WEBHOOK_AUTH_USERNAME ||
      password !== process.env.WEBHOOK_AUTH_PASSWORD
    ) {
      return NextResponse.json(
        { error: 'Unauthorized - Invalid credentials' },
        { status: 401 }
      );
    }

    // 2️⃣ PARSE PAYLOAD
    const payload: KeycloakWebhookPayload = await request.json();
    console.log('🔔 Received Keycloak webhook:', payload);

    if (payload.type !== 'REGISTER') {
      return NextResponse.json({
        message: 'Event ignored',
        type: payload.type,
      });
    }

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

    // 3️⃣ CHUẨN BỊ DỮ LIỆU
    const userProfile = {
      user_id: payload.userId,
      username: payload.details.username,
      first_name: payload.details.first_name || null,
      last_name: payload.details.last_name || null,
      email: payload.details.email,
    };

    console.log('🔄 Preparing UPSERT into PostgreSQL:', userProfile);

    // 4️⃣ UPSERT VÀO POSTGRES
    // ⚠️ LẤY CLIENT TỪ POOL VÀ SỬ DỤNG NÓ
    dbClient = await pool.connect();

    const query = `
      INSERT INTO users (
        user_id, username, first_name, last_name, email
      )
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (user_id)
      DO UPDATE SET
        username = EXCLUDED.username,
        first_name = EXCLUDED.first_name,
        last_name = EXCLUDED.last_name,
        email = EXCLUDED.email
      RETURNING *;
    `;

    const values = [
      userProfile.user_id,
      userProfile.username,
      userProfile.first_name,
      userProfile.last_name,
      userProfile.email,
    ];

    const result = await dbClient.query(query, values); // Sử dụng dbClient

    console.log('✅ Profile synchronized:', result.rows[0]);

    return NextResponse.json({
      success: true,
      message: 'User profile synchronized to PostgreSQL',
      data: result.rows[0],
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
  } finally {
    // 🔑 QUAN TRỌNG: TRẢ CLIENT VỀ POOL, BẤT KỂ THÀNH CÔNG HAY THẤT BẠI
    if (dbClient) {
      dbClient.release();
    }
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    service: 'keycloak-webhook-handler',
    timestamp: new Date().toISOString(),
  });
}
