/** Static export: `npm run build` writes plain HTML/CSS/JS to out/, which Netlify serves. */
const nextConfig = {
  output: 'export',
  images: { unoptimized: true },
  trailingSlash: true,
};
export default nextConfig;
