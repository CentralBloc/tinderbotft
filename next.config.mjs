/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'images-ssl.gotinder.com',
            },
        ],
    }
};

export default nextConfig;
