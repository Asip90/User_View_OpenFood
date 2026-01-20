/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/media/**', // Autorise toutes les images dans le dossier media
      },
      // Si vous avez d'autres domaines (ex: unsplash pour les placeholders), ajoutez-les ici :
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
};

export default nextConfig;