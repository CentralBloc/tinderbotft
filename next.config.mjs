/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'images-ssl.gotinder.com',
            },
            {
                protocol: 'https',
                hostname: 'flagsapi.com',
            }
        ],
    }
};

export default nextConfig;
