/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.js");

/** @type {import("./src/browser/i18n/locales").default} */
const locales = [
  {"locale": "en", "lang": "English"},
  {"locale": "es", "lang": "Español"},
  {"locale": "pt-br", "lang": "Português do Brasil"},
  {"locale": "de", "lang": "Deutsch"},
  {"locale": "fr", "lang": "Français"},
  {"locale": "he", "lang": "עִבְרִית"},
  {"locale": "ja", "lang": "日本語"},
  {"locale": "it", "lang": "Italiano"},
  {"locale": "nl", "lang": "Nederlands"},
  {"locale": "ru", "lang": "Русский"},
  {"locale": "tr", "lang": "Türkçe"},
  {"locale": "id", "lang": "Bahasa Indonesia"},
  {"locale": "zh-cn", "lang": "简体中文"},
  {"locale": "zh-tw", "lang": "繁體中文"},
  {"locale": "ko", "lang": "한국어"},
  {"locale": "ar", "lang": "العربية"},
  {"locale": "sv", "lang": "Svenska"}
];

// TODO more restrictive? This is added because we need to iframe umami
const contentSecurityPolicy = [
  `default-src * data:`,
  `img-src * blob: data:`,
  `script-src * 'unsafe-eval' 'unsafe-inline'`,
  `style-src * 'unsafe-inline'`,
  `frame-src *`,
  `worker-src * data: blob:`,
];

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'imgcdn.wolio.co',
        port: '',
        pathname: '/**',
      },
    ],
  },

  async redirects() {
    return [
      {
        source: '/dash',
        destination: '/dash/sites',
        permanent: false,
      },
      {
        source: '/start',
        destination: '/templates',
        permanent: true, // For 301 redirect
        // handle locales automatically
      },
    ]
  },
  // async rewrites() {
  //   return [
  //     {
  //       source: '/auth/:path*',
  //       destination: '/api/auth/:path*'
  //     },
  //   ]
  // },
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
  /**
   * If you are using `appDir` then you must comment the below `i18n` config out.
   *
   * @see https://github.com/vercel/next.js/issues/41980
   */
  i18n: {
    // TODO ts checks here?
    locales: locales.map(v => v.locale),
    defaultLocale: "en",
  },
  pageExtensions: ["ts", "tsx", "js", "jsx", "md", "mdx"],
  webpack: (config, { isServer }) => {
    // Fixes npm packages (mdx) that depend on `fs` module
    if (!isServer) {
      config.resolve.fallback.fs = false
    }
    return config
  },

  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: contentSecurityPolicy
              .join(';')
              .replace(/\s{2,}/g, ' ')
              .trim(),
          },
        ],
      },
    ]
  },
};

export default config;
