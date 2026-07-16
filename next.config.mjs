/** @type {import('next').NextConfig} */
const nextConfig = {
  // Termux/Android (no native SWC binary) → force wasm SWC bindings.
  experimental: {
    useWasmBinary: true,
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
};

export default nextConfig;
