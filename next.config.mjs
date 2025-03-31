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
            },
            {
                protocol: 'https',
                hostname: 'userimagess.s3.eu-north-1.amazonaws.com'
            }
        ],
    }
};

export default nextConfig;
