import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PushnotificationService {

  constructor() { }

  requestPermission(): void {
    Notification.requestPermission().then((permission) => {
      if (permission === 'granted') {
        console.log('Notification permission granted.');
      } else {
        console.log('Notification permission denied.');
      }
    });
  }

  showNotification(title: string, options: NotificationOptions): void {
    if (Notification.permission === 'granted') {
      navigator.serviceWorker.ready.then((registration) => {
        registration.showNotification(title, options);
      });
    }
}

}
