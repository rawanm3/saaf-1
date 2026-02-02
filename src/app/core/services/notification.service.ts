import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { Notification } from '../models/notification.model'; 
import { io, Socket } from 'socket.io-client';
import { environment } from '@environment/environment.prod'

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private apiUrl = 'http://api.saaf.net.sa:9000/api/notifications'; 

  private newNotificationSubject = new Subject<any>();

  constructor(private http: HttpClient) {

  }

  getNotifications(): Observable<Notification[]> {
    return this.http.get<Notification[]>(this.apiUrl);
  }

  markAllAsRead(): Observable<any> {
    return this.http.put(`${this.apiUrl}/markAllRead`, {});
  }

  markOneAsRead(id: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, {});
  }

  onNewNotification(): Observable<any> {
    return this.newNotificationSubject.asObservable();
  }
}