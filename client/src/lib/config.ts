export const config = {
  pocketbase: {
    url: import.meta.env.VITE_PB_URL || 'http://localhost:8090',
  },
  server: {
    url: import.meta.env.VITE_SERVER_URL || 'http://localhost:3000/api',
  },
};
