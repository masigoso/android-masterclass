import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.lovable.photomanager',
  appName: 'PhotoManager',
  webDir: 'dist',
  server: {
    url: 'https://5e7b2ecf-fd1a-4c55-8e98-03e01daa98de.lovableproject.com?forceHideBadge=true',
    cleartext: true
  }
};

export default config;
