import { Routes } from '@angular/router';
import { AppLayout } from './app/layout/component/app.layout';
import { Dashboard } from './app/pages/dashboard/dashboard';
import { Documentation } from './app/pages/documentation/documentation';
import { Landing } from './app/pages/landing/landing';
import { Notfound } from './app/pages/notfound/notfound';
import { Home } from '@/pages/home/home';
import { Userscrud } from '@/pages/userscrud/userscrud';
import { Post } from '@/pages/post/post';
import { BooksCrud } from '@/pages/books-crud/books-crud';
import { AuthorsCrud } from '@/pages/authors-crud/authors-crud';
import { CopiesCrud } from '@/pages/copies-crud/copies-crud';
import { EditionsCrud } from '@/pages/editions-crud/editions-crud';

export const appRoutes: Routes = [
    {
        path: '',
        component: AppLayout,
        children: [
            { path: '', component: Home },
            { path: 'userscrud', component: Userscrud },
            { path: 'bookscrud', component: BooksCrud },
            { path: 'authorscrud', component: AuthorsCrud },
            { path: 'copiescrud', component: CopiesCrud },
            { path: 'editionscrud', component: EditionsCrud },
            { path: 'uikit', loadChildren: () => import('./app/pages/uikit/uikit.routes') },
            { path: 'documentation', component: Documentation },
            { path: 'pages', loadChildren: () => import('./app/pages/pages.routes') },
            { path: 'posts/:id', component: Post}
        ]
    },
    { path: 'landing', component: Landing },
    { path: 'notfound', component: Notfound },
    { path: 'auth', loadChildren: () => import('./app/pages/auth/auth.routes') },
    { path: '**', redirectTo: '/notfound' }
];
