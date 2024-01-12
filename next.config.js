/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    images: {
        remotePatterns: [{ hostname: 'trunganhmedia.com' }, { hostname: 'www.aipromptsgalaxy.com' }, { hostname: 'bitnews.sgp1.digitaloceanspaces.com' }],
        remotePatterns: [{ hostname: 'trunganhmedia.com' }, { hostname: 'www.aipromptsgalaxy.com' }, { hostname: 'bitnews.sgp1.digitaloceanspaces.com' }, { hostname: 'pbs.twimg.com' }],
    },
    async redirects() {
        return [
            {
                source: '/',
                destination: '/dashboard',
                permanent: true, // save cached redirect
            },
        ];
    },
    webpack(config) {
        config.resolve.alias = {
            ...config.resolve.alias,
            o1js: require('path').resolve('node_modules/o1js'),
        };
        config.experiments = { ...config.experiments, topLevelAwait: true };
        config.optimization.minimizer = [];
        return config;
    },
    async headers() {
        return [
            {
                source: '/(.*)',
                headers: [
                    {
                        key: 'Cross-Origin-Opener-Policy',
                        value: 'same-origin',
                    },
                    {
                        key: 'Cross-Origin-Embedder-Policy',
                        value: 'require-corp',
                    },
                ],
            },
        ];
    },
};

module.exports = nextConfig;
