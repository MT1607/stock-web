import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  basePath: "/stock",
  async redirects() {
    return [
      {
        source: '/', 
        destination: '/stock', 
        basePath: false, // ⬅️ Rất quan trọng để tránh lỗi /stock/stock
        permanent: true, // ⬅️ Nên dùng 'true' trong Production
      },
    ];
  },
};

export default nextConfig;
