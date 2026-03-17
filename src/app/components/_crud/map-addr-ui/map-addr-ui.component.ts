import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  NgZone,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
  ViewChild,
  inject,
} from '@angular/core';
import { environment } from '@env/environment';
import { SimpleMapEntry, SimpleMapEntryResponse } from '@app/restsvc/hccl.service';
import mapboxgl from 'mapbox-gl';

@Component({
  selector: 'app-map-addr-ui',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './map-addr-ui.component.html',
  styleUrl: './map-addr-ui.component.scss',
})
export class MapAddrUiComponent implements OnChanges, AfterViewInit, OnDestroy {
  @Input() title: string = '';
  @Input() mapEntryResponse?: SimpleMapEntryResponse;
  @Output() pinClick = new EventEmitter<SimpleMapEntry>();
  @ViewChild('mapContainer') mapContainer?: ElementRef<HTMLDivElement>;

  private ngZone = inject(NgZone);

  loading = false;
  error = '';
  allResults: SimpleMapEntry[] = [];
  mapResults: SimpleMapEntry[] = [];
  selectedEntry: SimpleMapEntry | null = null;
  readonly mapboxAccessToken = environment.mapboxAccessToken;

  private map: mapboxgl.Map | null = null;
  private markers: mapboxgl.Marker[] = [];
  private mapReady = false;
  private mapRefreshTimeout: ReturnType<typeof setTimeout> | null = null;

  ngAfterViewInit(): void {
    this.loadMapEntries();
    this.scheduleMapRefresh();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['mapEntryResponse']) {
      this.loadMapEntries();
    }
  }

  ngOnDestroy(): void {
    if (this.mapRefreshTimeout) {
      clearTimeout(this.mapRefreshTimeout);
      this.mapRefreshTimeout = null;
    }
    this.clearMarkers();
    this.map?.remove();
    this.map = null;
  }

  private initMap(): void {
    if (!this.mapContainer || this.map) {
      return;
    }

    mapboxgl.accessToken = this.mapboxAccessToken;
    this.map = new mapboxgl.Map({
      container: this.mapContainer.nativeElement,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [-98.5795, 39.8283],
      zoom: 3
    });

    this.map.addControl(new mapboxgl.NavigationControl(), 'top-right');
    this.map.on('load', () => {
      this.mapReady = true;
      this.map?.resize();
      this.renderMarkers();
    });
  }

  loadMapEntries(): void {
    this.loading = false;
    this.error = '';
    this.allResults = this.mapEntryResponse?.searchResults || [];
    this.mapResults = this.allResults.filter(entry =>
      this.hasGeo(entry.geolocationLatitude) && this.hasGeo(entry.geolocationLongitude)
    );
    this.selectedEntry = this.mapResults[0] || null;
    this.scheduleMapRefresh();
  }

  getPinImage(entry: SimpleMapEntry): string {
    const label = (this.getDisplayName(entry) || 'A').trim().charAt(0).toUpperCase();
    const color = entry.color || 'blue';
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="36" viewBox="0 0 28 36">
        <path d="M14 0C6.27 0 0 6.27 0 14c0 9.58 12.51 20.77 13.04 21.24a1.5 1.5 0 0 0 1.92 0C15.49 34.77 28 23.58 28 14 28 6.27 21.73 0 14 0z" fill="${color}"/>
        <circle cx="14" cy="14" r="8.25" fill="#ffffff"/>
        <text x="14" y="18" text-anchor="middle" font-size="10" font-weight="700" fill="#1f2937">${label}</text>
      </svg>
    `;
    return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
  }

  onPinClick(entry: SimpleMapEntry): void {
    this.selectedEntry = entry;
    this.pinClick.emit(entry);
  }

  getDisplayName(entry: SimpleMapEntry): string {
    return entry.title || entry.entityType || 'Unknown Location';
  }

  getDisplayText(entry: SimpleMapEntry): string {
    return (entry.text || '').trim();
  }

  getLinkUrl(entry: SimpleMapEntry): string {    
    if ((entry.linkUrl || '').trim().length > 0) {
      return entry.linkUrl as string;
    }
    if (entry.calculatingUrl == true) {
      var xx =  "/e/" + entry.entityType + "/" + entry.entityId;
      //alert('xx: ' + xx);
      return xx;
    }    

    if (this.hasGeo(entry.geolocationLatitude) && this.hasGeo(entry.geolocationLongitude)) {
      return `https://www.google.com/maps?q=${entry.geolocationLatitude},${entry.geolocationLongitude}`;
    }
    return 'https://www.google.com/maps';
  }

  get showMissingGeoAlert(): boolean {
    if (this.loading || !!this.error || !this.allResults.length) {
      return false;
    }
    return this.mapResults.length === 0;
  }

  private hasGeo(value: number | undefined): boolean {
    return value !== undefined && value !== null && Number.isFinite(Number(value));
  }

  private renderMarkers(): void {
    if (!this.map || !this.mapReady) {
      return;
    }

    this.map.resize();
    this.clearMarkers();
    if (!this.mapResults.length) {
      return;
    }

    const bounds = new mapboxgl.LngLatBounds();

    this.mapResults.forEach((entry) => {
      const lng = Number(entry.geolocationLongitude ?? 0);
      const lat = Number(entry.geolocationLatitude ?? 0);

      const img = document.createElement('img');
      img.src = this.getPinImage(entry);
      img.alt = 'Map pin';
      img.style.width = '28px';
      img.style.height = '36px';
      img.style.filter = 'drop-shadow(0 3px 3px rgba(0,0,0,0.25))';

      const markerEl = document.createElement('button');
      markerEl.type = 'button';
      markerEl.style.border = '0';
      markerEl.style.padding = '0';
      markerEl.style.background = 'transparent';
      markerEl.style.cursor = 'pointer';
      markerEl.appendChild(img);

      markerEl.addEventListener('click', () => {
        this.ngZone.run(() => {
          this.onPinClick(entry);
        });
      });

      const title = `${this.escapeHtml(this.getDisplayName(entry))}`;
      const text = `${this.escapeHtml(this.getDisplayText(entry) || 'Address not available')}`;
      const linkText = this.escapeHtml(entry.linkText || 'Google Maps');
      const showingLink = entry.showingLink !== false;
      const linkLine = showingLink
        ? `<div><a href="${this.escapeHtml(this.getLinkUrl(entry))}" target="_blank" rel="noopener noreferrer">${linkText}</a></div>`
        : '';
      const popupHtml = `
        <div class="map-popup">
          <div class="map-popup-title">${title}</div>
          <div>${text}</div>
          ${linkLine}
        </div>
      `;

      const marker = new mapboxgl.Marker({ element: markerEl, anchor: 'bottom' })
        .setLngLat([lng, lat])
        .setPopup(new mapboxgl.Popup({ offset: 20 }).setHTML(popupHtml))
        .addTo(this.map as mapboxgl.Map);

      this.markers.push(marker);
      bounds.extend([lng, lat]);
    });

    if (this.mapResults.length === 1) {
      this.map.flyTo({ center: bounds.getCenter(), zoom: 12 });
      return;
    }
    this.map.fitBounds(bounds, { padding: 60, maxZoom: 13 });
  }

  private scheduleMapRefresh(): void {
    if (this.mapRefreshTimeout) {
      clearTimeout(this.mapRefreshTimeout);
    }
    this.mapRefreshTimeout = setTimeout(() => {
      this.mapRefreshTimeout = null;
      this.initMap();
      this.renderMarkers();
    }, 0);
  }

  private clearMarkers(): void {
    this.markers.forEach(marker => marker.remove());
    this.markers = [];
  }

  private escapeHtml(value: string): string {
    return value
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
}
