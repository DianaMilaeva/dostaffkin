import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Header } from '../../header/header';
type ShipmentStatus = { type: string; label: string; date: string };
@Component({ selector: 'app-track', standalone: true, imports: [CommonModule, FormsModule, Header], templateUrl: './track.html', styleUrl: './track.css' })
export class Track {
  trackNumber = ''; showResult = false; trackId = '';
  fromAddress = 'Москва, улица Арбат, 1'; toAddress = 'Минск, проспект Независимости, 58';
  statuses: ShipmentStatus[] = [];
  track(): void {
    const value = this.trackNumber.trim();
    if (!value) { alert('Заполните номер отправления'); this.showResult = false; return; }
    const number = Number(value);
    if (!Number.isFinite(number) || number < 1000 || number > 10000) { alert('К сожалению, мы не смогли найти отправление по данному номеру'); this.showResult = false; return; }
    this.trackId = `№${value}`;
    this.statuses = [
      { type: 'created', label: 'Создан', date: '10.01.2026' },
      { type: 'in-way', label: 'В пути: Вязьма', date: '15.01.2026' },
      { type: 'in-way', label: 'В пути: Орша', date: '16.01.2026' },
      { type: 'in-way', label: 'В пути: Минск', date: '18.01.2026' },
      { type: 'ready', label: 'Готов к выдаче', date: '25.01.2026' },
      { type: 'done', label: 'Вручен', date: '27.01.2026' }
    ]; this.showResult = true;
  }
}
