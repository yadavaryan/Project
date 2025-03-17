import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class SoketService {

  private socket: Socket;

  constructor() {
    this.socket = io('http://localhost:8000');
  }

  emit(eventName: string, data: any): void {
    this.socket.emit(eventName, data);
  }

  on(eventName: string, callback: (data: any) => void): void {
    this.socket.on(eventName, callback);
  }

  disconnect(): void {
    this.socket.disconnect();
  }
  
}
