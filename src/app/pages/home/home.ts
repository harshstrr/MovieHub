import { Component, ChangeDetectorRef } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Navbar } from '../../components/navbar/navbar';
import { Card } from '../../components/card/card';
import { Service } from '../../services/search';
import { Footer } from "../../components/footer/footer";
import { ViewCountService } from '../../services/appwrite';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink , CommonModule, Navbar, Card, Footer],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {

  loading = false;

  results: any = {
    Recent: [],
    trendRes: [],
    bollyMoviesTrend: [],
    hollyMoviesTrend: [],
    bollySeriesTrend: [],
    hollySeriesTrend: []
  };

  

  sectionState: any = {
    Recent: { limit: 50, loading: false, hasMore: true },
    trending: { limit: 5, loading: false, hasMore: true },
    bollyMoviesTrend: { limit: 20, loading: false, hasMore: true },
    hollyMoviesTrend: { limit: 20, loading: false, hasMore: true },
    bollySeriesTrend: { limit: 20, loading: false, hasMore: true },
    hollySeriesTrend: { limit: 20, loading: false, hasMore: true }
  };

  constructor(
    private router: Router,
    private searchService: Service,
    private cdr: ChangeDetectorRef,
    private viewCount: ViewCountService
  ) {}

  ngOnInit(): void {
    this.loadRecent();
    this.trending();
    this.loadTrending('bollyMoviesTrend', 'bolly_movies');
    this.loadTrending('hollyMoviesTrend', 'movies');
    this.loadTrending('bollySeriesTrend', 'bolly_series');
    this.loadTrending('hollySeriesTrend', 'series');
  }

 async trending() {
  this.loading = true;

  try {
    this.results.trendRes = await this.viewCount.loadTrending(10);

  } finally {
    this.loading = false;
    this.cdr.markForCheck();
  }
}

  loadTrending(key: string, type: string) {
    const state = this.sectionState[key];
    if (state.loading || !state.hasMore) return;

    state.loading = true;
    state.limit += 50;

    this.searchService
      .getTrending(type, state.limit)
      .subscribe((res:any) => {
        if (!res || res.length <= this.results[key].length) {
          state.hasMore = false;
        } else {
          this.results[key] = res;
        }

        state.loading = false;
        this.cdr.markForCheck();
      });
  }

  loadRecent() {
    const state = this.sectionState.Recent;
    if (state.loading || !state.hasMore) return;

    state.loading = true;
    state.limit += 30;

    this.searchService
      .getRecent('', state.limit)
      .subscribe((res: any) => {
        if (!res || res.length <= this.results.Recent.length) {
          state.hasMore = false;
        } else {
          this.results.Recent = res;
        }

        state.loading = false;
        this.cdr.markForCheck();
      });
  }



  onHorizontalScroll(
    event: Event,
    key: string,
    type?: string
  ) {
    const el = event.target as HTMLElement;
    const threshold = 120;

    if (el.scrollLeft + el.clientWidth >= el.scrollWidth - threshold) {
      if (key === 'Recent') {
        this.loadRecent();
      } else {
        this.loadTrending(key, type!);
      }
    }
  }


  scrollFromButton(event: MouseEvent, offset: number) {
    const button = event.currentTarget as HTMLElement;
    const container = button.parentElement?.querySelector(
      '.overflow-x-auto'
    ) as HTMLElement;

    if (!container) return;

    container.scrollBy({
      left: offset,
      behavior: 'smooth'
    });
  }


  goToDetail(item: any): void {
    const id =item.$id || item.record_id ;
    this.router.navigate(['content', item.contentType, id ]);
  }
}
