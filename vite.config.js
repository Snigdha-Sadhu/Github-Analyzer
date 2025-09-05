import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),  tailwindcss(),
    VitePWA({
      registerType:'autoUpdate',
      manifest:false,
      includeAssets:[
        'favicon.ico',
        'robots.txt',
        'icons/5043922.png',
        'icons/5043929.png'
      ],
      workbox:{
        globPatterns:['**/*.{js,css,html,ico,png,svg}'],
        navigateFallback:'/offline.html',
        runtimeCaching:[
          {
            urlPattern:/^https:\/\/api\.github\.com\/repos\/.*\/(languages|contributors|stats\/commit_activity).*$/i,
            handler:'NetworkFirst',
            options:{
              cacheName:'github-api',
              networkTimeoutSeconds:3,
              expiration:{
                maxEntries:50,maxAgeSeconds:24*60*60
              }
              }
            },
           {
              urlPattern:/^http:\/\/localhost:5000\/api\/generates$/i,
              handler:async ({event}) => {
                try{
                  return await workbox.strategies.NetworkFirst().handle({event});
                }catch(err){
                  return caches.match('/offline.html')
                }
              }
             
              }
          
        ]
      }
    })
  ],
  define:{
    'process.env':process.env
  },
  server:{
port:5174
  }
})
