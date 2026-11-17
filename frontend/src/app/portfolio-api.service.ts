import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { forkJoin, Observable } from 'rxjs';
import { ContactMessage, ContactReceipt, Profile, Project } from './portfolio.models';

@Injectable({ providedIn: 'root' })
export class PortfolioApiService {
  private readonly http = inject(HttpClient);

  getProfile(): Observable<Profile> {
    return this.http.get<Profile>('/api/profile');
  }

  getProjects(): Observable<Project[]> {
    return this.http.get<Project[]>('/api/projects');
  }

  getPortfolioContent(): Observable<{ profile: Profile; projects: Project[] }> {
    return forkJoin({
      profile: this.getProfile(),
      projects: this.getProjects(),
    });
  }

  submitContactMessage(message: ContactMessage): Observable<ContactReceipt> {
    return this.http.post<ContactReceipt>('/api/contact', message);
  }
}
