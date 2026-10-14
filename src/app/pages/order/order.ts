import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Header } from '../../header/header';
declare global { interface Window { ymaps?: any } }
type Calculation = { from: string; to: string; size: string; distance: string; duration: number; rate: number; total: number; speed: string };
@Component({ selector: 'app-order', standalone: true, imports: [FormsModule, Header], templateUrl: './order.html', styleUrl: './order.css' })
export class Order implements OnInit, OnDestroy {
  from = ''; to = ''; size = 'xs'; speed = 'regular'; calculating = false;
  distanceText = '—'; durationText = '—'; rateText = '—'; totalText: string | number = '—';
  customerName = ''; customerPhone = ''; comment = ''; submitted = false; orderId: number | string = '';
  calculation: Calculation | null = null; map: any; mapRoute: any;
  private readonly rates: Record<string, number> = { xs: 9, s: 13, m: 20, l: 27, xl: 35, max: 70 };
  private readonly minimums: Record<string, number> = { xs: 149, s: 199, m: 249, l: 349, xl: 499, max: 999 };
  ngOnInit(): void {
    const ymaps = window.ymaps;
    if (!ymaps) return;
    ymaps.ready(() => {
      if (!document.getElementById('map')) return;
      this.map = new ymaps.Map('map', { center: [55.751244, 37.618423], zoom: 5, controls: ['zoomControl'] });
      try { new ymaps.SuggestView('from'); new ymaps.SuggestView('to'); } catch { /* API suggestions may be unavailable */ }
    });
  }
  ngOnDestroy(): void { if (this.map) this.map.destroy(); }
  onRouteChange(): void { this.calculation = null; this.resetResult(); }
  selectSize(size: string): void { this.size = size; this.calculation = null; this.resetResult(); }
  selectSpeed(speed: string): void { this.speed = speed; this.calculation = null; this.resetResult(); }
  calculate(): void {
    if (!this.from.trim() || !this.to.trim()) return;
    if (!this.map || !window.ymaps) { alert('Карта не загрузилась. Проверьте подключение к интернету и API Яндекс Карт.'); return; }
    if (this.mapRoute) { this.map.geoObjects.remove(this.mapRoute); this.mapRoute = null; }
    this.calculating = true;
    const route = new window.ymaps.multiRouter.MultiRoute({ referencePoints: [this.from, this.to] }, { boundsAutoApply: true });
    this.mapRoute = route; this.map.geoObjects.add(route);
    route.model.events.add('requestsuccess', () => {
      this.calculating = false;
      try {
        const active = route.getActiveRoute(); if (!active) { this.failedCalculation(); return; }
        const km = active.properties.get('distance').value / 1000;
        let total = Math.max(this.minimums[this.size], Math.ceil(km * this.rates[this.size]));
        let duration = Math.min(30, 1 + Math.ceil(km / 80));
        if (this.speed === 'fast') { total = Math.ceil(total * 1.15); duration = Math.ceil(duration * 0.7); }
        this.calculation = { from: this.from, to: this.to, size: this.size, distance: km.toFixed(1), duration, rate: this.rates[this.size], total, speed: this.speed };
        this.distanceText = `${km.toFixed(1)} км`; this.durationText = `${duration} дн.`; this.rateText = `${this.rates[this.size]} ₽/км`; this.totalText = `${total} ₽`;
      } catch { this.failedCalculation(); }
    });
    route.model.events.add('requestfail', () => { this.calculating = false; this.failedCalculation(); });
  }
  private resetResult(): void { this.distanceText = this.durationText = this.rateText = '—'; this.totalText = '—'; }
  private failedCalculation(): void { this.calculation = null; this.resetResult(); alert('Не удалось построить маршрут. Проверьте адреса и выбранные параметры.'); }
  submitOrder(): void {
    if (!this.calculation) { alert('Сначала рассчитайте стоимость, чтобы оформить заявку.'); return; }
    const name = this.customerName.trim(); const phone = this.customerPhone.trim();
    if (!name) { alert('Введите имя'); return; }
    if (phone.replace(/\D/g, '').length < 10) { alert('Введите корректный телефон (минимум 10 цифр)'); return; }
    this.orderId = Math.floor(Math.random() * (100000 - 10000 + 1)) + 10000;
    console.log('Заказ: ' + this.orderId, { id: this.orderId, customer: { name, phone, comment: this.comment.trim() }, calculation: this.calculation, createdAt: new Date().toISOString() });
    this.submitted = true;
  }
}
