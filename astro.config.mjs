export default {
  site: 'https://your-portfolio-url.com',
  base: '/',
  buildOptions: {
    outDir: 'dist',
  },
  integrations: [
    // Add any integrations you might need here
  ],
  markdown: {
    // Markdown options
    shikiConfig: {
      theme: 'nord',
    },
  },
  vite: {
    // Vite options
    server: {
      port: 3000,
    },
  },
};