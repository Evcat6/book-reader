import { notify } from '@kyvg/vue3-notification';

class NotificationService {
  constructor(private notification: typeof notify) {}

  public info(text: string) {
    this.notification({
      type: 'info',
      text,
    });
  }

  public success(text: string) {
    this.notification({
      type: 'success',
      text,
    });
  }

  public error(text: string) {
    this.notification({
      type: 'error',
      text,
    });
  }
}

export { NotificationService };
