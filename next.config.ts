import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  redirects() {
    return [
      {
        source: '/archive/:uniqueID',
        destination: '/item/:uniqueID',
        permanent: true,
      },
    ]
  },
  output: "standalone",
};

export default nextConfig;
