import createNextIntlPlugin from "next-intl/plugin";

/** @type {import("next").NextConfig} */
const nextConfig: import("next").NextConfig = {
  transpilePackages: ["@workspace/ui"],
  images : {
    remotePatterns : [
      {
        protocol : "https",
        hostname : "rose-managing-bird-871.mypinata.cloud"
      }
    ]
  }
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);