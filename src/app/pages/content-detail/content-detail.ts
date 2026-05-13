import { Component, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Navbar } from '../../components/navbar/navbar';
import { Service } from '../../services/search';
import { ViewCountService } from '../../services/appwrite';
import { ExternalId, fetchMovieDetails } from '../../services/moviedb';

@Component({
  selector: 'app-content-detail',
  standalone: true,
  imports: [Navbar, DatePipe, CommonModule, FormsModule],
  templateUrl: './content-detail.html',
  styleUrl: './content-detail.css',
})
export class ContentDetail {
  loading = false;
  type: string | null = null;
  id: string | null = null;

  results: any = null;
  stream: any = null;
  imdbId: string | null = null;
  trendSeasons: any = null;
  trendStreams: any = null;

  selectedValue: any = 'Season 1';

  constructor(
    private route: ActivatedRoute,
    private contentService: Service,
    private appwrite: ViewCountService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.id = params.get('id');
      this.type = params.get('type');

      const routePath = this.route.snapshot.routeConfig?.path;

      if (routePath === 'trending/:id' && this.id) {
        this.loadTrendingDetail(this.id);
        return;
      }

      if (this.type && this.id) {
        this.loadContentDetail(this.type, this.id);
      }
    });
  }

  private async loadTrendingDetail(id: string) {
    try {
      const res = await this.appwrite.loadById(id);
      this.results = res;
      this.stream = JSON.parse(res.seasons) || JSON.parse(res.streams);
      this.type = res.contentType ;


      this.cdr.markForCheck();
    } catch (err) {
      console.error('Trending load error', err);
    }
  }

  private loadContentDetail(type: string, id: string) {
    this.loading = true;
    
    // First, fetch the core details structure
    this.contentService.getDetail(type, id).subscribe({
      next: (res) => {
        this.results = res;
        this.cdr.markForCheck();

        fetchMovieDetails(String(this.results.title).split("(")[0]).then(details => {
              if(details.results.length > 0) {
                const mediaType = details.results[0].media_type === 'movie' ? 'movie' : 'tv';
                ExternalId(details.results[0].id, mediaType).then(external => {
                  if(external.imdb_id !== null){
                    this.imdbId = external.imdb_id;
                    this.cdr.markForCheck();
                  }
                });
              }
            });


        this.contentService.getStream(type, id).subscribe({
          next: (streamRes: any) => {
            this.stream = streamRes;

            if (type.includes('series') || type.includes('anime')) {
              this.trendSeasons = streamRes?.seasons;
            } else {
              this.trendStreams = streamRes?.streams;
  
            }

            // Track view AFTER everything definitely exists
            this.appwrite.trackView(
              this.results.record_id,
              this.results.featured_image,
              this.results.title,
              this.results.categories,
              type,
              this.trendSeasons,
              this.trendStreams
            );

          
            
          },
          error: (err) => console.error(err),
          complete: () => {
            this.loading = false;
            this.cdr.markForCheck();
          }
        });
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
        this.cdr.markForCheck();
      }
    });
  }
  
  select() {
    console.log("DON'T TOUCH ME !!!");
  }
}
