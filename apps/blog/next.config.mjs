import { PHASE_DEVELOPMENT_SERVER } from 'next/constants.js';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
  reactStrictMode: true,
  webpack(config) {
    // Jupyter imports named JSON5 functions; its ESM bundle only exports a default.
    config.resolve.alias['json5$'] = require.resolve('json5/lib/index.js');
    return config;
  },
};

// Keep the preview cache separate so it cannot replace the Pages export.
const config = (phase) => ({
  ...nextConfig,
  distDir: phase === PHASE_DEVELOPMENT_SERVER ? '.next-dev' : 'docs',
});

export default config;
