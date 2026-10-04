import { ChangeDetectorRef, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RouterExtensions } from '@nativescript/angular';
import { isAndroid } from '@nativescript/core';
import { GoogleMap, MapReadyEvent, MapTapEvent, Marker } from '@nativescript/google-maps';
import { editarDireccion } from './alumnos.reducer';
import { Alumno, AlumnosService, coordenadasValidas } from './alumnos.service';
import { environment } from '../../config/environment';

@Component({ selector: 'ns-direccion', templateUrl: './direccion.component.html', standalone: false })
export class DireccionComponent {
  private alumnoId: number;
  get alumno(): Alumno | undefined { return this.datos.alumnos.find(a => a.id === this.alumnoId); }
  readonly mapaHabilitado = isAndroid ? environment.mapsAndroidEnabled : environment.mapsIosEnabled;
  lat = '';
  lng = '';
  mensaje = '';
  private mapa?: GoogleMap;
  private marcador?: Marker;
  constructor(private datos: AlumnosService, ruta: ActivatedRoute, private router: RouterExtensions,
    private vista: ChangeDetectorRef) {
    this.alumnoId = Number(ruta.snapshot.paramMap.get('id'));
    if (this.alumno) { this.lat = String(this.alumno.direccion.lat); this.lng = String(this.alumno.direccion.lng); }
  }
  listo(evento: MapReadyEvent): void { this.mapa = evento.map; this.actualizarMarcador(); }
  seleccionar(evento: MapTapEvent): void {
    this.lat = String(evento.coordinate.lat);
    this.lng = String(evento.coordinate.lng);
    this.actualizarMarcador(evento.coordinate);
    this.mensaje = 'Punto seleccionado. Pulsa Aplicar coordenadas para confirmar.';
    this.vista.markForCheck();
  }
  guardar(): void {
    if (!this.alumno) return;
    if (!coordenadasValidas(this.lat, this.lng)) { this.mensaje = 'Latitud entre -90 y 90; longitud entre -180 y 180.'; return; }
    this.datos.dispatch(editarDireccion(this.alumno.id, { lat: Number(this.lat), lng: Number(this.lng) }));
    this.actualizarMarcador();
    this.mensaje = 'Coordenadas aplicadas: ' + this.alumno.direccion.lat + ', ' +
      this.alumno.direccion.lng + '. Guardadas durante esta sesión.';
    this.vista.markForCheck();
  }
  private actualizarMarcador(posicion = this.alumno?.direccion): void {
    if (!this.mapa || !this.alumno || !posicion) return;
    if (this.marcador) this.mapa.removeMarker(this.marcador);
    this.marcador = this.mapa.addMarker({ position: posicion, title: this.alumno.nombre });
  }
  volver(): void {
    if (this.router.canGoBack()) this.router.back();
    else this.router.navigate(['/alumnos']);
  }
}
