import { Routes } from '@angular/router';
import { Posts } from './posts/posts';
import { SinglePost } from './single-post/single-post';

export const routes: Routes = [
    { path: '', component: Posts },
    { path: 'posts/:id', component: SinglePost}
];
