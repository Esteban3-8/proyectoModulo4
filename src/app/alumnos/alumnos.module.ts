import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { 
  
  NativeScriptCommonModule, 
  NativeScriptFormsModule, 
  NativeScriptRouterModule, 
  registerElement 

} from '@nativescript/angular';
import { AlumnosComponent } from './alumnos.component';
import { DireccionComponent } from './direccion.component';


registerElement('MapView', () => require('@nativescript/google-maps').MapView);
@NgModule({
  imports: [NativeScriptCommonModule, FormsModule, NativeScriptFormsModule,
    NativeScriptRouterModule.forChild([

      { path: '', component: AlumnosComponent, pathMatch: 'full' },
      { path: ':id/direccion', component: DireccionComponent },

    ])],
  declarations: [AlumnosComponent, DireccionComponent],
  schemas: [NO_ERRORS_SCHEMA],
})
export class AlumnosModule {}
