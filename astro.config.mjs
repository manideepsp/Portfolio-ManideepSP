export default {
  site: 'https://manideepsp.github.io/Portfolio-ManideepSP',
  base: '/Portfolio-ManideepSP/',
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