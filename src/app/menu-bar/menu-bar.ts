import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MenuItem, PrimeIcons } from 'primeng/api';
import { AvatarModule } from 'primeng/avatar';
import { BadgeModule } from 'primeng/badge';
import { InputTextModule } from 'primeng/inputtext';
import { MenubarModule } from 'primeng/menubar';
import { RippleModule } from 'primeng/ripple';

@Component({
  selector: 'app-menu-bar',
  imports: [MenubarModule, AvatarModule, BadgeModule, InputTextModule, RippleModule, CommonModule],
  templateUrl: './menu-bar.html',
})
export class MenuBar {
  items: MenuItem[] = [];

  ngOnInit() {
    this.items = [
      {
        label: 'Posts',
        icon: PrimeIcons.HOME,
        routerLink: '/',
      },
      {
        label: 'Filtrar',
        icon: PrimeIcons.FILTER,
        routerLink: '/filter',
      },
    ];
  }
}
