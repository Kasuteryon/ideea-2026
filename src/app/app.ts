import { Component, AfterViewInit, OnDestroy } from '@angular/core';

export interface WorldClock {
  name: string;
  timeZone: string;
  timeStr?: string;
  color: string;
  country: string;
}

@Component({
  selector: 'app-root',
  imports: [],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements AfterViewInit, OnDestroy {
  private observer!: IntersectionObserver;
  private timeInterval: any;

  public worldClocks: WorldClock[] = [
    { name: 'CDMX', timeZone: 'America/Mexico_City', color: '#22c55e', country: 'Mexico' },
    { name: 'South Korea', timeZone: 'Asia/Seoul', color: '#f59e0b', country: 'South Korea' },
    { name: 'Germany', timeZone: 'Europe/Berlin', color: '#29c4f8', country: 'Germany' },
    { name: 'Romania', timeZone: 'Europe/Bucharest', color: '#f472b6', country: 'Romania' },
    { name: 'India', timeZone: 'Asia/Kolkata', color: '#c084fc', country: 'India' },
    { name: 'Finland', timeZone: 'Europe/Helsinki', color: '#22c55e', country: 'Finland' },
    { name: 'Canada', timeZone: 'America/Toronto', color: '#f59e0b', country: 'Canada' }
  ];

  // Currency Interactive State
  public selectedCurrencyLabel: string = '';
  public selectedCurrencyImage: string = 'currency.png';

  public selectCurrency(label: string, imgUrl: string): void {
    this.selectedCurrencyLabel = label;
    this.selectedCurrencyImage = imgUrl;
  }

  // Metro Map Zoom State
  public isMetroMapZoomed: boolean = false;

  public toggleMetroMap(): void {
    this.isMetroMapZoomed = !this.isMetroMapZoomed;
  }

  private updateClocks(): void {
    const now = new Date();
    this.worldClocks.forEach(c => {
      try {
        c.timeStr = new Intl.DateTimeFormat('en-US', {
          timeStyle: 'short',
          timeZone: c.timeZone
        }).format(now);
      } catch (e) {
        c.timeStr = '--:--';
      }
    });
  }

  ngAfterViewInit(): void {
    this.updateClocks();
    this.timeInterval = setInterval(() => this.updateClocks(), 1000);

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
    if (this.timeInterval) {
      clearInterval(this.timeInterval);
    }
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}
