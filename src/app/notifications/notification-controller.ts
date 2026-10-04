export interface PushMessage {
  notification?: { title?: string; body?: string };
  data?: Record<string, string>;
}

export interface PushClient {
  start(listener: (message: PushMessage) => void): Promise<void>;
  stop(): void;
}

// Sin dependencias nativas: permite probar los fallos de Firebase en Jasmine.
export class NotificationController {
  private client?: PushClient;
  private started = false;
  private disposed = false;

  constructor(private show: (text: string) => void,
    private warn: () => void = () => console.warn('Firebase no disponible; la aplicación continúa.')) {}

  async start(enabled: boolean, load: () => Promise<PushClient>): Promise<void> {
    if (!enabled || this.started || this.disposed) return;
    this.started = true;
    try {
      const client = await load();
      if (this.disposed) { client.stop(); return; }
      this.client = client;
      await client.start(message => {
        if (this.disposed) return;
        try {
          const title = message?.notification?.title || message?.data?.title;
          const body = message?.notification?.body || message?.data?.body;
          const text = [title, body].filter(v => typeof v === 'string' && v.trim()).join('\n');
          if (text) this.show(text);
        } catch { this.warn(); }
      });
      if (this.disposed) client.stop();
    } catch {
      this.stopClient();
      this.warn();
    }
  }

  stop(): void { this.disposed = true; this.stopClient(); }
  private stopClient(): void {
    try { this.client?.stop(); } catch { this.warn(); }
    this.client = undefined;
  }
}
