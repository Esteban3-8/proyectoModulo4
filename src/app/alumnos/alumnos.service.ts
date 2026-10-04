import { Injectable } from '@angular/core';
import { createStore } from 'redux';
import { alumnosReducer } from './alumnos.reducer';
import type { Alumno } from './alumnos.reducer';
export { Alumno } from './alumnos.reducer';

export function promedio(alumno: Alumno): string {
  return (alumno.materias.reduce((total, m) => total + m.calificacion, 0) / alumno.materias.length).toFixed(2);
}
export function coordenadasValidas(lat: string, lng: string): boolean {

  return lat.trim() !== '' && lng.trim() !== '' &&
    Number.isFinite(Number(lat)) && Number.isFinite(Number(lng)) &&
    Math.abs(Number(lat)) <= 90 && Math.abs(Number(lng)) <= 180;

}
@Injectable({ providedIn: 'root' })
export class AlumnosService {

  private readonly store = createStore(alumnosReducer);
  get alumnos(): Alumno[] { return this.store.getState().alumnos; }
  readonly dispatch = this.store.dispatch;
  readonly subscribe = this.store.subscribe;
}
