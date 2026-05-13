import { ChangeDetectorRef, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

import { Navbar } from '../../components/navbar/navbar';
import { Card } from '../../components/card/card';
import { Service } from '../../services/search';

@Component({
  selector: 'app-content',
  standalone: true,
  imports: [Navbar, Card, CommonModule],
  templateUrl: './content.html',
  styleUrl: './content.css',
})
export class Content {

  // API type (machine-readable)
  type = '';

  // UI title (human-readable)
  title = '';

  // pagination
  page = 1;
  limit = 30;
  hasMore = true;
  loading = false;

  // data
  allResults: any;
  results: any[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private content: Service,
    private cdr: ChangeDetectorRef
  ) {}


  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const contentType = params.get('contentType');
      const genre = params.get('genres');

      this.resetState();

      // GENRE FLOW
      if (genre) {
        this.type = genre;
        this.title = genre;
        this.fetchGenres();
        return;
      }

      // TRENDING FLOW
      if (contentType) {
        this.title = contentType;
        this.type = this.mapContentType(contentType);
        this.fetchTrending();
      }
    });
  }


  fetchTrending(): void {
    this.loading = true;

    this.content.getTrending(this.type, 8000).subscribe(res => {
      this.allResults = res || [];
      this.loading = false;
      this.appendPage();
    });
  }

  fetchGenres(): void {
    this.loading = true;

    this.content.getGenres(this.type, 8000).subscribe(res => {
      this.allResults = res || [];

      this.loading = false;
      this.appendPage();
    });
  }


  appendPage(): void {
    const start = (this.page - 1) * this.limit;
    const end = start + this.limit;

    const chunk = this.allResults.slice(start, end);

    if (chunk.length === 0) {
      this.hasMore = false;
      return;
    }

    this.results = [...this.results, ...chunk];
    this.page++;

    this.cdr.markForCheck();
  }

  loadMore(): void {
    if (this.loading || !this.hasMore) return;
    this.appendPage();
  }

  goToDetail(item: any): void {
    if ( item?.source_table) this.type =  this.mapContentType(item.source_table);

    if (!item?._id) return;
    this.router.navigate(['content', this.type, item._id]);
  }


  resetState(): void {
    this.page = 1;
    this.hasMore = true;
    this.loading = false;
    this.results = [];
    this.allResults = [];
  }

  mapContentType(type: string): string {
    switch (type) {
      case 'bollywood movies':
        return 'bolly_movies';
      case 'hollywood movies':
        return 'movies';
      case 'bollywood series':
        return 'bolly_series';
      case 'hollywood series':
        return 'series';
      case 'bollywood_movies':
        return 'bolly_movies';
      case 'hollywood_movies':
        return 'movies';
      case 'bollywood_series':
        return 'bolly_series';
      case 'hollywood_series':
        return 'series';
      default:
        return type;
    }
  }
}
