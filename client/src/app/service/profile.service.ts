import { Injectable } from '@angular/core';
import { BASE_URL } from '../shared/constants/urls';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Profile } from '../shared/interfaces/profile';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  private profileUrl = `${BASE_URL}/profiles`;

  constructor(private http: HttpClient) { }

  createProfile(profile: Profile): Observable<any> {
    return this.http.post(`${this.profileUrl}/add`, profile);
  }

  getProfile(id: string): Observable<any> {
    return this.http.get<any>(`${this.profileUrl}/${id}`);
  }

  getProfiles(): Observable<any> {
    return this.http.get<any>(`${this.profileUrl}/`);
  }

  updateProfile(id: string, profile: Profile): Observable<any> {
    console.log("Indside profile update API", id, profile);
    return this.http.put(`${this.profileUrl}/update/${id}`, profile);
  }

  deleteProfile(id: string): Observable<any> {
    return this.http.delete(`${this.profileUrl}/delete/${id}`);
  }

}
