import { NgModule } from '@angular/core';
import { NativeScriptRouterModule } from '@nativescript/angular';
@NgModule({
  imports: [NativeScriptRouterModule.forRoot([
    { path: '', redirectTo: '/alumnos', pathMatch: 'full' },
    { path: 'alumnos', loadChildren: () => import('./alumnos/alumnos.module').then(m => m.AlumnosModule) },
    { path: '**', redirectTo: '/alumnos' },
  ])],
  exports: [NativeScriptRouterModule],
})
export class AppRoutingModule {}
