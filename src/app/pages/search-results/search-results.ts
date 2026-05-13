import { Component, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs';
import { CommonModule } from '@angular/common';

import { Service } from '../../services/search';
import { Navbar } from '../../components/navbar/navbar';
import { Card } from '../../components/card/card';


@Component({
  selector: 'app-search-results',
  standalone: true,
  imports: [Navbar, CommonModule, Card],
  templateUrl: './search-results.html',
  styleUrl: './search-results.css',
})
export class SearchResults {
  query = '';
  results: any[] = [];
  loading = false;

  constructor(
      private route: ActivatedRoute,
      private router: Router,

      private searchService: Service,
      private cdr: ChangeDetectorRef
    ) {}

   ngOnInit(): void {
    this.route.queryParams
      .pipe(
        switchMap(params => {
          this.loading = true;
          this.query = params['q'] || '';
          return this.searchService.search(this.query);
        })
      )
      .subscribe({
        next: res => {
          this.results = res;
          this.loading = false;
          
          
          this.cdr.markForCheck();
        },
        error: () => {
          this.loading = false;
        }
      });
  }

  goToDetail(item: any): void {
    const type = item.contentType;
    const id = item._id;

    if (!type || !id) return;

    this.router.navigate(["content", type, id]);
  }
}
