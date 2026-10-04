import type { ImageSource } from '@nativescript/core';
import type { UnknownAction } from 'redux';
export interface Alumno {

  id: number;
  nombre: string;
  materias: { nombre: string; calificacion: number }[];
  foto: string | ImageSource;
  direccion: { lat: number; lng: number };

}

export interface AlumnosState { readonly alumnos: Alumno[] }
export const estadoInicial: AlumnosState = { alumnos: [
    { id: 1, nombre: 'alumno1', foto: '~/Imagen3.png', direccion: { lat: 14.6349, lng: -90.5069 },

      materias: [{ nombre: 'Matematicas', calificacion: 80 }, { nombre: 'Lenguaje', calificacion: 90 }, 
                  { nombre: 'Ciencias', calificacion: 85 }] },
    { id: 2, nombre: 'alumno2', foto: '~/Imagen3.png', direccion: { lat: 14.625, lng: -90.515 },
      materias: [
        { nombre: 'Matematicas', calificacion: 75 }, 
        { nombre: 'Lenguaje', calificacion: 85 }, 
        { nombre: 'Ciencias', calificacion: 95 }
      ] 
    },
    { id: 3, nombre: 
      'alumno3', foto: '~/Imagen3.png', 
      direccion: { lat: 14.61, lng: -90.53 },
      materias: [
        { nombre: 'Matematicas', calificacion: 90 }, 
        { nombre: 'Lenguaje', calificacion: 90 }, 
        { nombre: 'Ciencias', calificacion: 95 }
      ] 
    },
  ] };
export const editarNombre = (id: number, nombre: string) => ({ type: 'alumnos/nombre', id, nombre });
export const editarCalificacion = (id: number, materia: string, calificacion: number) => ({ type: 'alumnos/calificacion', id, materia, calificacion });
export const editarFoto = (id: number, foto: Alumno['foto']) => ({ type: 'alumnos/foto', id, foto });
export const editarDireccion = (id: number, direccion: Alumno['direccion']) => ({ type: 'alumnos/direccion', id, direccion });

export function alumnosReducer(state: AlumnosState = estadoInicial, action: UnknownAction): AlumnosState {
  const alumno = state.alumnos.find(a => a.id === action.id);
  if (!alumno) return state;
  let actualizado: Alumno;
  switch (action.type) {
    case 'alumnos/nombre':
      if (typeof action.nombre !== 'string' || !action.nombre.trim()) return state;
      if (alumno.nombre === action.nombre.trim()) return state;
      actualizado = { ...alumno, nombre: action.nombre.trim() };
      break;
    case 'alumnos/calificacion':
      if (typeof action.calificacion !== 'number' || !Number.isFinite(action.calificacion) || action.calificacion < 0 || action.calificacion > 100) return state;
      if (!alumno.materias.some(m => m.nombre === action.materia && m.calificacion !== action.calificacion)) return state;
      actualizado = { ...alumno, materias: alumno.materias.map(m => m.nombre === action.materia ? { ...m, calificacion: action.calificacion as number } : m) };
      break;
    case 'alumnos/foto':
      if (!action.foto) return state;
      actualizado = { ...alumno, foto: action.foto as Alumno['foto'] };
      break;
    case 'alumnos/direccion': {
      const d = action.direccion as Alumno['direccion'];
      if (!d || !Number.isFinite(d.lat) || !Number.isFinite(d.lng) || Math.abs(d.lat) > 90 || Math.abs(d.lng) > 180) return state;
      actualizado = { ...alumno, direccion: { ...d } };
      break;
    }
    default: return state;
  }
  return { ...state, alumnos: state.alumnos.map(a => a.id === alumno.id ? actualizado : a) };
}
