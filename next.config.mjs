/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Agrega esta línea para permitir que el celular de tu hermano reciba los scripts
  allowedDevOrigins: ['192.168.1.9'],
}

export default nextConfig