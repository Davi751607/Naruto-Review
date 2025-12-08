
export default nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // NarutoDB / Fandom
      { protocol: 'https', hostname: 'narutodb.xyz' },
      { protocol: 'https', hostname: 'static.wikia.nocookie.net' },
      { protocol: 'https', hostname: 'vignette.wikia.nocookie.net' },

      // MyAnimeList / Jikan
      { protocol: 'https', hostname: 'cdn.myanimelist.net' },
      { protocol: 'https', hostname: 'api.jikan.moe' },

      // genéricos que aparecem às vezes
      { protocol: 'https', hostname: 'i.imgur.com' },
      { protocol: 'https', hostname: 'imgur.com' },
    ],
  },
};
module.exports = nextConfig;
