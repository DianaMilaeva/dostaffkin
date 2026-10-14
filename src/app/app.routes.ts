import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Order } from './pages/order/order';
import { Track } from './pages/track/track';

export const routes: Routes = [
  { path: '', component: Home, title: 'Dostaffkin — доставка посылок' },
  { path: 'order', component: Order, title: 'Оформление доставки' },
  { path: 'track', component: Track, title: 'Отследить посылку' },
  { path: '**', redirectTo: '' }
];
