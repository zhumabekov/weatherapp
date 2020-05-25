import { Component, OnInit, ElementRef } from '@angular/core';
import { HttpService} from './http.service';
import { ChartDataSets } from 'chart.js';
import { Color, Label } from 'ng2-charts';
import {WeatherStat} from './weatherStat';

@Component({
    selector: 'weather-app',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    providers: [HttpService]
})
export class AppComponent implements OnInit{ 
    yearStart: number;
    yearEnd: number;
    weatherStats: WeatherStat[]=[];
    weatherYears: number[]=[];

    public lineChartData: ChartDataSets[] = [
        { data: [], label: '' },
    ];
    public lineChartLabels: Label[] = [];
    public lineChartColors: Color[] = [
        {
            borderColor: '#32a852',
            backgroundColor: 'rgba(255,0,0,0)',
        },
    ];
    public lineChartLegend = true;
    public lineChartType = 'line';

    constructor(private httpService: HttpService, private elementRef: ElementRef){}
    ngOnInit(){
        this.getInform();
    }
    getInform(type: string = "temperature"){
        this.lineChartData[0].label = type=="temperature" ? "Температура" : "Осадки";
        this.httpService.getData(type).subscribe(data=>{
            console.log("e",data)
            var temp = {};
            data.forEach(res=>{
                let year = +res.fulldate.substr(0,4);
                if (temp.hasOwnProperty(year)) {
                    temp[year]["total"]+=res.value;
                    temp[year]["count"]++;
                } else {
                    temp[year] = {
                        "total": res.value,
                        "count": 1
                    };
                }
            })
            for (let year in temp) {
                var stat = temp[year];
                this.weatherYears.push(+year);
                this.weatherStats.push({year: year, average: +(stat["total"] / stat["count"]).toFixed(2)});
            }
            this.buildChartData();
        });
    }
    buildChartData() {
        this.lineChartData[0].data = [];
        this.lineChartLabels = [];
        
        for (let i = 0; i < this.weatherStats.length; i++) {
            const stat = this.weatherStats[i];
            if (this.yearStart != null && +stat.year < this.yearStart) {
                continue;
            }
            if (this.yearEnd != null && +stat.year > this.yearEnd) {
                continue;
            }
            this.lineChartLabels.push(stat.year);
            this.lineChartData[0].data.push(stat.average);
        }
    }
}