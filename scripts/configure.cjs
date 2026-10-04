const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
if (fs.existsSync(path.join(root, '.env'))) process.loadEnvFile(path.join(root, '.env'));
const env = process.env;
const write = (file, text) => {
  const target = path.join(root, file);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, text);
};
const androidKey = env.GOOGLE_MAPS_ANDROID_KEY || '';
const iosKey = env.GOOGLE_MAPS_IOS_KEY || '';
const firebase = {
  apiKey: (env.FIREBASE_API_KEY || '').trim(),
  projectId: (env.FIREBASE_PROJECT_ID || '').trim(),
  senderId: (env.FIREBASE_MESSAGING_SENDER_ID || '').trim(),
  androidAppId: (env.FIREBASE_ANDROID_APP_ID || '').trim(),
  iosAppId: (env.FIREBASE_IOS_APP_ID || '').trim(),
};
for (const key of [androidKey, iosKey]) {
  if (key && !/^[A-Za-z0-9_-]+$/.test(key)) throw Error('La clave de Maps contiene caracteres inválidos.');
}
write('src/config/environment.generated.ts', 'export const generatedEnvironment = ' + JSON.stringify({
  mapsAndroidEnabled: !!androidKey,
  mapsIosEnabled: !!iosKey,
  firebase,

}, null, 2) + ';\n');
write('App_Resources/Android/src/main/res/values/maps.xml',
  '<resources><string name="google_maps_key">' + androidKey + '</string></resources>\n');
write('App_Resources/iOS/credentials.xcconfig', 'GOOGLE_MAPS_IOS_KEY = ' + iosKey + '\n');
// Recursos nativos para que FCM funcione también cuando Android arranca en segundo plano.
// Sin credenciales válidas se sobrescriben con un recurso vacío, evitando valores anteriores.
const firebaseAndroid = !!(/^AIza[A-Za-z0-9_-]{35}$/.test(firebase.apiKey) &&
  /^[a-z][a-z0-9-]{4,28}[a-z0-9]$/.test(firebase.projectId) && /^\d+$/.test(firebase.senderId) &&
  new RegExp('^1:' + firebase.senderId + ':android:[a-fA-F0-9]+$').test(firebase.androidAppId));
const xml = value => value.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' }[c]));
const resources = firebaseAndroid ? {
  google_app_id: firebase.androidAppId, google_api_key: firebase.apiKey,
  gcm_defaultSenderId: firebase.senderId, project_id: firebase.projectId,
} : {};
write('App_Resources/Android/src/main/res/values/firebase.xml', '<resources>\n' +
  Object.entries(resources).map(([name, value]) => `  <string name="${name}" translatable="false">${xml(value)}</string>`).join('\n') + '\n</resources>\n');
console.log('Configuración generada. Maps Android: ' + !!androidKey + ', Maps iOS: ' + !!iosKey);

