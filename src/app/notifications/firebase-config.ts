export interface FirebaseConfig {
  apiKey: string;
  projectId: string;
  senderId: string;
  androidAppId: string;
  iosAppId: string;
}

export function firebaseConfigured(config: FirebaseConfig, platform: 'android' | 'ios'): boolean {
  const appId = platform === 'android' ? config.androidAppId : config.iosAppId;
  return /^AIza[A-Za-z0-9_-]{35}$/.test(config.apiKey) &&
    /^[a-z][a-z0-9-]{4,28}[a-z0-9]$/.test(config.projectId) && /^\d+$/.test(config.senderId) &&
    new RegExp('^1:' + config.senderId + ':' + platform + ':[a-fA-F0-9]+$').test(appId);
}
