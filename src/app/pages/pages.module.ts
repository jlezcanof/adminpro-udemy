import { PAGES_ROUTES } from './pages.routes';

import { SharedModule } from '../shared/shared.module';

import { FormsModule } from '@angular/forms';

import { NgModule } from '@angular/core';

// Modulos

// ng2-charts
import { ChartsModule } from 'ng2-charts';

import { PagesComponent } from './pages.component';

import { DashboardComponent } from './dashboard/dashboard.component';
import { ProgressComponent } from './progress/progress.component';
import { Graficas1Component } from './graficas1/graficas1.component';

// temporal
import { IncrementadorComponent } from '../components/incrementador/incrementador.component';
import { GraficoDonaComponent } from '../components/grafico-dona/grafico-dona.component';

@NgModule({
    declarations: [
     DashboardComponent,
     ProgressComponent,
     Graficas1Component,
     PagesComponent,
     IncrementadorComponent,
     GraficoDonaComponent
    ],
    exports: [
    DashboardComponent,
     ProgressComponent,
     Graficas1Component,
    ]
    , imports : [
        SharedModule,
        PAGES_ROUTES,
        FormsModule,
        ChartsModule
    ]
})

 export class PagesModule { }
