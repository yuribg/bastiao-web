import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { BastiaoReaderComponent } from './features/bastiao-reader/bastiao-reader.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'ler/:id', component: BastiaoReaderComponent },
    { path: '**', redirectTo: '' }
];
