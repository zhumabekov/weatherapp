import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { WeatherDto } from './weatherDto';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class HttpService {
    weatherlist: WeatherDto[];
    constructor(private http: HttpClient) { }

    getData(param: string): Observable<WeatherDto[]> {
        return this.http.get(`http://localhost:3000/${param}.json`).pipe(map(data => {
            let weatherlist = Object.values(data);
            return weatherlist.map(function (weather: any) {
                return { fulldate: weather.t, value: weather.v };
            });
        }));
    }
}