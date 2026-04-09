import withMdx from "@next/mdx";

/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.js");

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,
  output: "export",

  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'imgcdn.wolio.co',
        port: '',
        pathname: '/**',
      },
    ],
  },

  eslint: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has lint errors.
    // !! WARN !!
    // ignoreDuringBuilds: true,
  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    // ignoreBuildErrors: true,
  },
  pageExtensions: ["ts", "tsx", "js", "jsx", "md", "mdx"],
  webpack: (config, { isServer }) => {
    // Fixes npm packages (mdx) that depend on `fs` module
    if (!isServer) {
      config.resolve.fallback.fs = false
    }
    return config
  },
};

export default withMdx({
  extension: /\.mdx?$/,
})(config);
