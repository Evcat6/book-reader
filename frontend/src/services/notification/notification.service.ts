import type { notify } from '@kyvg/vue3-notification';

class NotificationService {
  public constructor(private notification: typeof notify) {}

  public info(text: string): void {
    this.notification({
      type: 'info',
      text,
    });
  }

  public success(text: string): void {
    this.notification({
      type: 'success',
      text,
    });
  }

  public error(text: string): void {
    this.notification({
      type: 'error',
      text,
    });
  }
}

export { NotificationService };
