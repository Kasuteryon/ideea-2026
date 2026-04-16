import { Component, AfterViewInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-root',
  imports: [],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements AfterViewInit, OnDestroy {
  private observer!: IntersectionObserver;

  // Currency Interactive State
  public selectedCurrencyLabel: string = '';
  public selectedCurrencyImage: string = 'currency.png';

  public selectCurrency(label: string, imgUrl: string): void {
    this.selectedCurrencyLabel = label;
    this.selectedCurrencyImage = imgUrl;
  }

  ngAfterViewInit(): void {
    // Scroll-triggered fade-in animations
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px',
      }
    );

    document.querySelectorAll('.fade-in').forEach((el) => {
      this.observer.observe(el);
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', (e: Event) => {
        e.preventDefault();
        const href = (anchor as HTMLAnchorElement).getAttribute('href');
        if (href) {
          const target = document.querySelector(href);
          if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }
      });
    });
  }

  ngOnDestroy(): void {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}
