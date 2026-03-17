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
import { HcclAddrCriteria, HcclAddrGETData, HcclService } from '@app/restsvc/hccl.service';
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
  @Input() criteria?: HcclAddrCriteria;
  // if entity is provided, use it to display the address on the map
  // if criteria is provided, use it to load the addresses
  // if both are provided, use the entity to display the address on the map
  @Input() entity?: HcclAddrGETData;
  @Output() pinClick = new EventEmitter<HcclAddrGETData>();
  @ViewChild('mapContainer') mapContainer?: ElementRef<HTMLDivElement>;

  protected hcclService = inject(HcclService);
  private ngZone = inject(NgZone);

  loading = false;
  error = '';
  allResults: HcclAddrGETData[] = [];
  mapResults: HcclAddrGETData[] = [];
  selectedAddr: HcclAddrGETData | null = null;
  readonly mapboxAccessToken = environment.mapboxAccessToken;

  private map: mapboxgl.Map | null = null;
  private markers: mapboxgl.Marker[] = [];
  private mapReady = false;
  private mapRefreshTimeout: ReturnType<typeof setTimeout> | null = null;
  private entityHydrationId: string | null = null;

  ngAfterViewInit(): void {
    this.scheduleMapRefresh();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['entity']) {
      this.loadEntityAddress();
      return;
    }

    if (changes['criteria']) {
      this.loadAddresses();
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

  loadAddresses(): void {
    if (this.entity) {
      this.loadEntityAddress();
      return;
    }

    if (!this.criteria) {
      this.error = 'No address criteria was provided.';
      this.allResults = [];
      this.mapResults = [];
      this.selectedAddr = null;
      return;
    }

    this.loading = true;
    this.error = '';
    this.allResults = [];
    this.mapResults = [];
    this.selectedAddr = null;

    this.hcclService.findHcclAddrs(this.criteria).subscribe({
      next: (response) => {
        this.allResults = response.searchResults || [];
        this.mapResults = this.allResults.filter(addr =>
          this.hasGeo(addr.geolocationLatitude) && this.hasGeo(addr.geolocationLongitude)
        );
        this.loading = false;
        this.scheduleMapRefresh();
      },
      error: (err) => {
        console.error('Error loading map addresses:', err);
        this.error = 'Unable to load addresses for map view.';
        this.loading = false;
      }
    });
  }

  private loadEntityAddress(): void {
    if (!this.entity) {
      this.entityHydrationId = null;
      this.allResults = [];
      this.mapResults = [];
      this.selectedAddr = null;
      this.error = '';
      this.loading = false;
      this.scheduleMapRefresh();
      return;
    }

    this.loading = false;
    this.error = '';
    this.allResults = [this.entity];
    this.mapResults = this.hasGeo(this.entity.geolocationLatitude) && this.hasGeo(this.entity.geolocationLongitude)
      ? [this.entity]
      : [];
    this.selectedAddr = this.entity;
    this.scheduleMapRefresh();

    // In some callers, entity is a partial object that does not include geolocation.
    // If we have an id, hydrate from API so a pin can still render when coordinates exist in DB.
    if (!this.mapResults.length && this.entity.id) {
      this.hydrateEntityById(this.entity.id);
    }
  }

  getPinImage(addr: HcclAddrGETData): string {
    const label = (this.getDisplayName(addr) || 'A').trim().charAt(0).toUpperCase();
    const color = 'blue';
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="36" viewBox="0 0 28 36">
        <path d="M14 0C6.27 0 0 6.27 0 14c0 9.58 12.51 20.77 13.04 21.24a1.5 1.5 0 0 0 1.92 0C15.49 34.77 28 23.58 28 14 28 6.27 21.73 0 14 0z" fill="${color}"/>
        <circle cx="14" cy="14" r="8.25" fill="#ffffff"/>
        <text x="14" y="18" text-anchor="middle" font-size="10" font-weight="700" fill="#1f2937">${label}</text>
      </svg>
    `;
    return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
  }

  onPinClick(addr: HcclAddrGETData): void {
    this.selectedAddr = addr;
    this.pinClick.emit(addr);
  }

  getDisplayName(addr: HcclAddrGETData): string {
    return addr.entityDisplayName || addr.parentEntityName || addr.addrLine1 || 'Unknown Location';
  }

  getDisplayAddress(addr: HcclAddrGETData): string {
    const parts = [addr.addrLine1, addr.addrLine2, addr.city, addr.stateCode, addr.zip, addr.countryCode]
      .filter(part => !!part && part.trim().length > 0);
    return parts.join(', ');
  }

  get showMissingGeoEntityAlert(): boolean {
    if (!this.entity || this.loading || !!this.error) {
      return false;
    }

    const entityToCheck = this.selectedAddr || this.entity;
    return !this.hasGeo(entityToCheck.geolocationLatitude) || !this.hasGeo(entityToCheck.geolocationLongitude);
  }

  get entityForDebug(): HcclAddrGETData | undefined {
    return this.selectedAddr || this.entity;
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

    this.mapResults.forEach((addr) => {
      const lng = Number(addr.geolocationLongitude ?? 0);
      const lat = Number(addr.geolocationLatitude ?? 0);

      const img = document.createElement('img');
      img.src = this.getPinImage(addr);
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
          this.onPinClick(addr);
        });
      });

      var title = `${this.escapeHtml(this.getDisplayName(addr))} on Google Maps`;
      var text = `${this.escapeHtml(this.getDisplayAddress(addr) || 'Address not available')}`;
      var linkLine = `<div><a href="www.google.com" _target="blank">Google Maps</a></div>`;
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

  private hydrateEntityById(id: string): void {
    if (this.entityHydrationId === id) {
      return;
    }
    this.entityHydrationId = id;
    this.loading = true;

    this.hcclService.getHcclAddrById(id).subscribe({
      next: (fullEntity) => {
        if (this.entity?.id !== id) {
          this.loading = false;
          return;
        }

        this.loading = false;
        this.error = '';
        this.allResults = [fullEntity];
        this.mapResults = this.hasGeo(fullEntity.geolocationLatitude) && this.hasGeo(fullEntity.geolocationLongitude)
          ? [fullEntity]
          : [];
        this.selectedAddr = fullEntity;
        this.scheduleMapRefresh();
      },
      error: (err) => {
        console.error('Error hydrating map entity by id:', err);
        this.loading = false;
        this.error = 'Unable to load address coordinates for map view.';
      },
      complete: () => {
        this.entityHydrationId = null;
      }
    });
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
