import { Routes } from '@angular/router';
import { AppLayout } from './app/layout/component/app.layout';
import { Notfound } from './app/pages/notfound/notfound';
import { Home } from '@/pages/home/home';
import { Userscrud } from '@/pages/userscrud/userscrud';
import { Post } from '@/pages/post/post';
import { BooksCrud } from '@/pages/books-crud/books-crud';
import { AuthorsCrud } from '@/pages/authors-crud/authors-crud';
import { CopiesCrud } from '@/pages/copies-crud/copies-crud';
import { EditionsCrud } from '@/pages/editions-crud/editions-crud';
import { PrestamosCrud } from '@/pages/prestamos-crud/prestamos-crud';

export const appRoutes: Routes = [
    {
        path: '',
        component: AppLayout,
        children: [
            { path: '', component: Home },
            { path: 'userscrud', component: Userscrud },
            { path: 'prestamos', component: PrestamosCrud },
            { path: 'bookscrud', component: BooksCrud },
            { path: 'authorscrud', component: AuthorsCrud },
            { path: 'copiescrud', component: CopiesCrud },
            { path: 'editionscrud', component: EditionsCrud },
            { path: 'pages', loadChildren: () => import('./app/pages/pages.routes') },
            { path: 'posts/:id', component: Post}
        ]
    },
    { path: 'notfound', component: Notfound },
    { path: '**', redirectTo: '/notfound' }
];
