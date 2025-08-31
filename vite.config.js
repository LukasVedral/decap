export default {
  build: {
    rollupOptions: {
      input: {
        admin: 'src/admin/admin.js'
      },
      output: {
        entryFileNames: 'js/[name].bundle.js'
      }
    },
    outDir: 'src/static',
    emptyOutDir: false
  }
};
