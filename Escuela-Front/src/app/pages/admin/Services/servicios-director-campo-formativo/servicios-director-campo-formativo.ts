import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CampoFormativoModel, Combo } from '../../../../models/campo-formativo.model';


@Injectable({
  providedIn: 'root'
})
export class ServiciosCampoFormativo {

private apiUrlCampoFormativoListar = 'https://unusual-sharyl-utsemintegradora-3bae85c1.koyeb.app/campoFormativo';
  private apiUrlCampoFormativoCrear   = 'https://unusual-sharyl-utsemintegradora-3bae85c1.koyeb.app/campoFormativo/NuevoCampo';
  private apiUrlCampoFormativoEditar  = 'https://unusual-sharyl-utsemintegradora-3bae85c1.koyeb.app/campoFormativo/Actualizar';


  constructor(private http: HttpClient) {}
  
  
  CrearCampoFormativo(campoformativo: CampoFormativoModel): Observable<any> {
    return this.http.post(this.apiUrlCampoFormativoCrear, campoformativo, {
      responseType: 'text' as 'json'
    });
  }

  ObtenerCampoFormativo(): Observable<CampoFormativoModel[]> {
    return this.http.get<CampoFormativoModel[]>(this.apiUrlCampoFormativoListar);
  }

   ObtenerCampoFormativoA(): Observable<Combo[]> {
    return this.http.get<Combo[]>(`${this.apiUrlCampoFormativoListar}/combo`);
  }
  ActualizarCampoFormativo(id: string, campoformativo: CampoFormativoModel): Observable<any> {
    return this.http.put(`${this.apiUrlCampoFormativoEditar}/${id}`, campoformativo, {
      responseType: 'text' as 'json'
    });
  }
}