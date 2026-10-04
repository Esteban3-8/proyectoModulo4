
## Google Maps

Crear **raiz/.env**, al mismo nivel que package.json, copiando .env.example.

Editar ese archivo y agregar la clave:

    GOOGLE_MAPS_ANDROID_KEY=tu_clave_android


## Entorno y versiones

Angular declara Node ^22.22.3 || ^24.15.0 || >=26.0.0.

    npm install -g nativescript@9.1.1
    ns doctor

Android requiere Android Studio/SDK, JDK configurado y dispositivo o emulador. Configuración nativa del proyecto: compile/target SDK **35**, Build Tools **35**, mínimo Android API **24**. 

## Alumnos y calificaciones con Redux

`AlumnosService` utiliza un store de Redux y el reducer de `src/app/alumnos/alumnos.reducer.ts`.
La pantalla permite consultar alumnos y promedios, editar nombres y guardar calificaciones entre 0 y 100.
Cada botón Guardar despacha una acción; las fotos y direcciones también se actualizan mediante acciones.
El reducer devuelve nuevos objetos sin modificar el estado anterior. Los cambios duran la sesión; no se guardan en Firebase ni en disco.

## Firebase Cloud Messaging opcional

Completar en `.env` los valores de la **app nativa** registrada en Firebase:

```dotenv
FIREBASE_API_KEY=tu_api_key
FIREBASE_PROJECT_ID=tu_proyecto
FIREBASE_MESSAGING_SENDER_ID=tu_numero_de_proyecto
FIREBASE_ANDROID_APP_ID=1:numero_de_proyecto:android:identificador
FIREBASE_IOS_APP_ID=1:numero_de_proyecto:ios:identificador
```

Para Android, los valores corresponden a `current_key`, `project_id`, `project_number` y `mobilesdk_app_id` del `google-services.json` descargado de Firebase. Para iOS, usar los valores equivalentes de `GoogleService-Info.plist`. Solo hace falta el App ID de la plataforma que vas a ejecutar. Registrar el paquete/bundle `org.nativescript.tareamodulo4` en el mismo proyecto Firebase.

Ejecutar `npm run android` (o `npm run ios` en macOS). El script `configure` y el hook de NativeScript leen las variables, generan la configuración TypeScript y los recursos Android de FCM. Las variables del sistema prevalecen sobre `.env`. Se genera `firebase.xml`, por lo que no hace falta copiar `google-services.json`; la tarea Gradle que exige ese archivo se desactiva. Al quitar las variables y reconstruir, los recursos de Firebase quedan vacíos.

Sin configuración, con valores incompletos o con formato inválido no se inicia Firebase ni se piden permisos. Los errores de carga, registro o red se capturan y la aplicación continúa. El código de Firebase permanece disponible en el proyecto. Las claves de cliente se incluyen en la aplicación compilada; no introducir credenciales de administrador ni claves privadas de cuentas de servicio.

Con la aplicación en primer plano, un mensaje `notification.title/body` o `data.title/body` muestra un toast durante 4,5 segundos. En segundo plano, los mensajes con payload `notification` los presenta el sistema operativo; al pulsarlos se muestra el toast al abrir la aplicación. Los mensajes de datos vacíos se ignoran. El servicio cancela listeners y temporizadores al destruirse.

Para una prueba real:

1. Ejecutar en Android con Google Play Services o en un iPhone físico y aceptar permisos.
2. Obtener en el depurador el campo `token` de `FirebaseNotificationsService` una vez registrado el dispositivo. No se imprime automáticamente en los logs.
3. En Firebase Console → Messaging, crear una notificación con título y cuerpo y usar **Enviar mensaje de prueba** con ese token.
4. Mantener la app abierta para comprobar el toast; después probar con la app en segundo plano.

iOS requiere además habilitar **Push Notifications** para el App ID/perfil de firma y cargar la clave APNs en Firebase Console. Configurar el entitlement `aps-environment` mediante Xcode para el perfil de desarrollo o distribución correspondiente. Para mensajes de datos en segundo plano habilitar también Background Modes → Remote notifications. Esos requisitos de Apple no se sustituyen con variables de entorno.

Referencia de la integración nativa: [NativeScript Firebase Messaging](https://docs.nativescript.org/plugins/firebase-messaging).

## Pruebas Jasmine, Karma y reporte JUnit

Instalar dependencias con `npm install`. Necesitas Chrome/Chromium o Edge. En Windows se detectan las rutas habituales; si tu navegador está en otra ruta, definir `CHROME_BIN` con la ruta al ejecutable.

Desde la raíz del proyecto:

```powershell
npm run test:unit
```

Ejecuta Jasmine en Chrome Headless mediante Karma y genera **`reports/junit/unit-tests.xml`**, usando `karma-junit-reporter`. El archivo se reemplaza con los resultados de cada ejecución y contiene cantidad de pruebas, fallos y casos individuales; puede abrirse como texto o importarse en un sistema CI compatible con JUnit.

```powershell
# Pruebas existentes más la suite Jasmine con reporte XML:
npm test

# Verificaciones de TypeScript y plantillas Angular:
npm run typecheck
npm run check:angular
```

Las pruebas unitarias cubren el reducer real y su store de Redux, inmutabilidad, validaciones, aislamiento entre sesiones y el controlador de notificaciones (sin credenciales, errores, payloads y limpieza). No requieren credenciales, emulador ni conexión a Firebase. La recepción push real y la presentación nativa requieren la prueba manual en dispositivo descrita arriba.

Configuración del reporte: [karma-junit-reporter](https://github.com/karma-runner/karma-junit-reporter).
