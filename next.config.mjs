/** @type {import('next').NextConfig} */

const securityHeaders = [
  {
    key: "Content-Security-Policy",
    value: `
      default-src 'self'; 
      script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.paypal.com https://www.sandbox.paypal.com https://vercel.live; 
      style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net; 
      img-src 'self' data: https://www.paypal.com https://www.paypalobjects.com; 
      font-src 'self'; 
      connect-src 'self' https://geocode.maps.co https://www.sandbox.paypal.com https://www.paypal.com wss://ws-us3.pusher.com; 
      frame-src https://www.sandbox.paypal.com https://vercel.live https://www.paypal.com;
    `
      .replace(/\n/g, "")
      .trim(),
  },
];

const nextConfig = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.icons8.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
