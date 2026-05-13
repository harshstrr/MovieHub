import { Routes } from '@angular/router';
import { SearchResults } from './pages/search-results/search-results';
import { Home } from './pages/home/home';
import { ContentDetail } from './pages/content-detail/content-detail';
import { Content } from './pages/content/content';

export const routes: Routes = [
  {
    path: '',
    component: Home,

  },
  {
    path: 'trending/:id',
    component: ContentDetail,

  },
  {
    path: 'content/:type/:id',
    component: ContentDetail,

  },
  {
    path: 'category/:genres',
    component: Content,

  },
  {
    path: 'search',
    component: SearchResults,

  },
  {
    path: 'collection/:contentType',
    component: Content,

  },
  {
    path: '**',
    redirectTo: '',
  }
];
