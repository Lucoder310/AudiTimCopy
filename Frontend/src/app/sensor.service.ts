import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface HeatmapFrame {
  time: string;
  grid: number[][];
  }
  
// sensor.service.ts
@Injectable({ providedIn: 'root' })
export class Sensor {
  private baseUrl = 'http://localhost:3000/api'; // statt localhost? backend = Docker-Service-Name

  constructor(private http: HttpClient) {}

  getAllSensors(): Observable<any> {
    return this.http.get(`${this.baseUrl}/allsensors`);
  }

  getNewSensors(): Observable<any> {
    return this.http.get(`${this.baseUrl}/newsensors`);
  }

  generateDummyData(): Observable<any> {
    return this.http.get(`${this.baseUrl}/generate`);
  }

  getHeatmapArray(): Observable<{ heatmap: number[][] }> {
  return this.http.get<{ heatmap: number[][] }>(`${this.baseUrl}/getArray`);
  }

  getHeatmapArrays(): Observable<{ frames: number[][][] }> {
    return this.http.get<{ frames: number[][][] }>(`${this.baseUrl}/getArrays`);
  }

  getHeatmaps(): Observable<{ data: HeatmapFrame[] }> {
  return this.http.get<{ data: HeatmapFrame[] }>(`${this.baseUrl}/getAllHeatmaps`);
  }

  postHeatmapsRange(start: string, stop: string): Observable<{ data: HeatmapFrame[] }> {
  return this.http.post<{ data: HeatmapFrame[] }>(`${this.baseUrl}/postHeatmapsRange`, {
    start,
    stop,
  });
  }

  getHeatmapRange(): Observable<{ oldest: string; newest: string }> {
  return this.http.get<{ oldest: string; newest: string }>(`${this.baseUrl}/getHeatmapRange`);
  }
}
