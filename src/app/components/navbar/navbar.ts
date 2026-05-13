import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ConnectedPosition, OverlayModule } from '@angular/cdk/overlay';
@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink , OverlayModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar implements OnInit {
  title = ['Movie','Hub'];
  searchQuery = '';
  results: any[] = [];
  genres = [
    { label: 'Action', slug: 'action' },
    { label: 'Adventure', slug: 'adventure' },
    { label: 'Comedy', slug: 'comedy' },
    { label: 'Drama', slug: 'drama' },
    { label: 'Romance', slug: 'romance' },
    { label: 'Thriller', slug: 'thriller' },
    { label: 'Horror', slug: 'horror' },
    { label: 'Mystery', slug: 'mystery' },
    { label: 'Crime', slug: 'crime' },
    { label: 'Fantasy', slug: 'fantasy' },
    { label: 'Sci-Fi', slug: 'sci-fi' },
    { label: 'Animation', slug: 'animation' },
    { label: 'Family', slug: 'family' },
    { label: 'Music', slug: 'music' },
    { label: 'War', slug: 'war' },
    { label: 'History', slug: 'history' },
    { label: 'Documentary', slug: 'documentary' },
    { label: '18+ / Adult', slug: 'adult', danger: true },
    { label: '2160p (4K)', slug: '2160p', full: true }
  ];


  constructor( private router: Router) {}
  ngOnInit(): void {
    // Component initialization
  }



 
  onSubmit(): void {
    if (!this.searchQuery.trim()) return;

    this.router.navigate(['/search'], {
      queryParams: { q: this.searchQuery },
    });
    this.searchQuery = ''
  }
  goToDetail(item: any): void {
    const type = item.contentType;
    const id = item._id;

    if (!type || !id) return;

    this.router.navigate([type, id]);
  }


  isGenresOpen = false;



positions: ConnectedPosition[] = [
  {
    originX: 'center',
    originY: 'bottom',
    overlayX: 'center',
    overlayY: 'top',
    offsetY: 8,
  },
];

dropdownTop = 0;
dropdownLeft = 0;

toggleGenres(btn: HTMLElement) {
  this.isGenresOpen = !this.isGenresOpen;

  if (this.isGenresOpen) {
    const rect = btn.getBoundingClientRect();

    // vertical: bottom of button + gap
    this.dropdownTop = rect.bottom + 8;

    // horizontal: align dropdown under text, not button box
    this.dropdownLeft =
      rect.left + (rect.width / 2) - (224 / 2); // 224px = w-56
  }
}

closeGenres() {
  this.isGenresOpen = false;
}

openGenres = false;



tGenres() {
  this.openGenres = !this.openGenres;
}


}
