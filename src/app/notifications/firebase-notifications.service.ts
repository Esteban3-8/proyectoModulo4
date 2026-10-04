import { Injectable, NgZone, OnDestroy } from '@angular/core';
import { Application, isAndroid } from '@nativescript/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../../config/environment';
import { NotificationController, PushClient } from './notification-controller';
import { firebaseConfigured } from './firebase-config';

@Injectable({ providedIn: 'root' })
export class FirebaseNotificationsService implements OnDestroy {
  readonly toast$ = new BehaviorSubject('');
  token: string | null = null;
  private timer?: ReturnType<typeof setTimeout>;
  private foreground = true;
  private suspend = () => { this.foreground = false; this.clearToast(); };
  private resume = () => { this.foreground = true; };
  private controller: NotificationController;

  constructor(private zone: NgZone) {
    this.controller = new NotificationController(text => {
      if (!this.foreground) return;
      this.zone.run(() => {
        this.clearToast();
        this.toast$.next(text);
        this.timer = setTimeout(() => this.zone.run(() => this.toast$.next('')), 4500);
      });
    });
    Application.on(Application.suspendEvent, this.suspend);
    Application.on(Application.resumeEvent, this.resume);
  }

  start(): Promise<void> {
    const config = environment.firebase;
    const appId = isAndroid ? config.androidAppId : config.iosAppId;
    const platform = isAndroid ? 'android' : 'ios';
    const enabled = firebaseConfigured(config, platform);
    return this.controller.start(enabled, async (): Promise<PushClient> => {
      // Los módulos permanecen en el proyecto; solo se inicializan con configuración completa.
      const { firebase, FirebaseOptions } = await import('@nativescript/firebase-core');
      const { Messaging, AuthorizationStatus } = await import('@nativescript/firebase-messaging');
      const options = new FirebaseOptions();
      options.apiKey = config.apiKey;
      options.googleAppId = appId;
      options.gcmSenderId = config.senderId;
      options.projectId = config.projectId;
      // Android puede haber creado la app mediante los recursos generados antes de ejecutar JS.
      let initialized = false;
      try { initialized = !!firebase().app(); } catch { /* Todavía no existe una app nativa. */ }
      if (!initialized) await firebase().initializeApp(options);
      const messaging = new Messaging();
      let stopped = false;
      return {
        start: async listener => {
          messaging.showNotificationsWhenInForeground = false;
          messaging.onMessage(listener);
          messaging.onNotificationTap(listener);
          messaging.onToken(token => { if (!stopped) this.token = token; });
          const status = await messaging.requestPermission({ ios: { alert: true, sound: true, badge: true } });
          if (stopped || (status !== AuthorizationStatus.AUTHORIZED && status !== AuthorizationStatus.PROVISIONAL)) return;
          await messaging.registerDeviceForRemoteMessages();
          if (stopped) return;
          const token = await messaging.getToken();
          if (!stopped) this.token = token;
        },
        stop: () => {
          stopped = true;
          messaging.onMessage(null);
          messaging.onNotificationTap(null);
          messaging.onToken(null);
        },
      };
    });
  }

  private clearToast(): void {
    if (this.timer) clearTimeout(this.timer);
    this.zone.run(() => this.toast$.next(''));
  }
  ngOnDestroy(): void {
    this.controller.stop();
    Application.off(Application.suspendEvent, this.suspend);
    Application.off(Application.resumeEvent, this.resume);
    this.clearToast();
    this.toast$.complete();
  }
}
