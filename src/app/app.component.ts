import { Component, OnInit, ElementRef } from '@angular/core';
import { HttpService } from './http.service';
import { ChartDataSets } from 'chart.js';
import { Color, Label } from 'ng2-charts';
import { WeatherAverageStat } from './weatherAverageStat';
import { WeatherDto } from './weatherDto';

@Component({
    selector: 'weather-app',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    providers: [HttpService]
})
export class AppComponent implements OnInit {
    yearStart: number;
    yearEnd: number;
    averageStats: WeatherAverageStat[] = [];

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

    constructor(private httpService: HttpService, private elementRef: ElementRef) { }
    ngOnInit() {
        this.getWeatherStats();
    }
    getWeatherStats(type: string = "temperature") {
        this.lineChartData[0].label = type == "temperature" ? "Температура" : "Осадки";
        this.httpService.getData(type).subscribe((dayStats: WeatherDto[]) => {
            let temp = {};
            dayStats.forEach((dayStat: WeatherDto) => {
                let year = +dayStat.fulldate.substr(0, 4);
                if (temp.hasOwnProperty(year)) {
                    temp[year].total += dayStat.value;
                    temp[year].count++;
                } else {
                    temp[year] = {
                        total: dayStat.value,
                        count: 1
                    };
                }
            })
            for (let year in temp) {
                const yearStat = temp[year];
                this.averageStats.push({ year: +year, average: +(yearStat.total / yearStat.count).toFixed(2) });
            }
            this.buildChartData();
        });
    }
    buildChartData() {
        this.lineChartData[0].data = [];
        this.lineChartLabels = [];

        for (let i = 0; i < this.averageStats.length; i++) {
            const stat = this.averageStats[i];
            if (this.yearStart != null && stat.year < this.yearStart) {
                continue;
            }
            if (this.yearEnd != null && stat.year > this.yearEnd) {
                continue;
            }
            this.lineChartLabels.push(stat.year.toString());
            this.lineChartData[0].data.push(stat.average);
        }
    }
}