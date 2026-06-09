/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    disableStaticImages: true,
  },
  webpack(config) {
    // Disable Next.js image metadata imports and @svgr for SVGs so
    // `import icon from './icon.svg'` returns a URL string (Vite-compatible).
    config.module.rules.forEach((rule) => {
      if (rule.loader === 'next-image-loader') {
        rule.exclude = /\.(png|jpe?g|gif|webp|svg|ico|avif|bmp)$/i;
      }

      if (rule.test && /\.svg/i.test(rule.test.toString())) {
        rule.exclude = /\.svg$/i;
      }

      if (Array.isArray(rule.oneOf)) {
        rule.oneOf.forEach((oneOfRule) => {
          if (oneOfRule.test && /\.svg/i.test(oneOfRule.test.toString())) {
            oneOfRule.exclude = /\.svg$/i;
          }
        });
      }
    });

    config.module.rules.push({
      test: /\.(png|jpe?g|gif|webp|svg|ico|avif|bmp)$/i,
      type: 'asset/resource',
      generator: {
        filename: 'static/media/[name].[hash][ext]',
      },
    });

    return config;
  },
};

export default nextConfig;
