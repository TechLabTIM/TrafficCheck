import { HttpClient, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LbsService {

constructor(private http: HttpClient,
  @Inject('BASE_URL') private baseUrl: string
) { }

makeSimpleRequest(msisdns: string[], iterations: number, profileNumber: number, codeRegion: string): Observable<any> {
  let params = new HttpParams()
    .set('iterations', iterations)
    .set('profileNumber', profileNumber)
    .set('codeRegion', codeRegion);

  msisdns.forEach(msisdn => {
    params = params.append('msisdns', msisdn);
  });

  return this.http.get(this.baseUrl + 'api/launchlbs/lelistdata', { params });
}

}
