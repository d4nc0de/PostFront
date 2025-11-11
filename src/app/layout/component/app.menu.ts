import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AppMenuitem } from './app.menuitem';

@Component({
    selector: 'app-menu',
    standalone: true,
    imports: [CommonModule, AppMenuitem, RouterModule],
    template: `<ul class="layout-menu">
        <ng-container *ngFor="let item of model; let i = index">
            <li app-menuitem *ngIf="!item.separator" [item]="item" [index]="i" [root]="true"></li>
            <li *ngIf="item.separator" class="menu-separator"></li>
        </ng-container>
    </ul> `
})
export class AppMenu {
    model: MenuItem[] = [];

    ngOnInit() {
        this.model = [
            {
                label: 'Home',
                items: [
                    { label: 'Home', icon: 'pi pi-fw pi-home', routerLink: ['/'] },
                    { label: 'Gestión de Usuarios', icon: 'pi pi-fw pi-chart-line', routerLink: ['/userscrud'] },
                    { label: 'Gestión de Préstamos', icon: 'pi pi-fw pi-inbox', routerLink: ['/prestamos'] },
                    { label: 'Gestión de Libros', icon: 'pi pi-fw pi-book', routerLink: ['/bookscrud'] },
                    { label: 'Gestión de Autores', icon: 'pi pi-fw pi-users', routerLink: ['/authorscrud'] },
                    { label: 'Gestión de Copias', icon: 'pi pi-fw pi-copy', routerLink: ['/copiescrud'] },
                    { label: 'Gestión de Ediciones', icon: 'pi pi-fw pi-barcode', routerLink: ['/editionscrud'] }
                ],
            },
            {
                label: 'Source Code',
                items: [
                    {
                        label: 'Frontend',
                        icon: 'pi pi-fw pi-github',
                        url: 'https://github.com/d4nc0de/PostFront',
                        target: '_blank'
                    },
                    {
                        label: 'Backend',
                        icon: 'pi pi-fw pi-github',
                        url: 'https://github.com/d4nc0de/PostBack',
                        target: '_blank'
                    },
                ]
            }
        ];
    }
}
