/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                hostname: 'utmost-pig-452.convex.cloud',
            }
        ]
    }
};

export default nextConfig;
