import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import {
  Component,
  HostBinding,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  ViewEncapsulation,
} from '@angular/core';
import {
  GoogleMapsLatLng,
  GoogleMapsMarkerOptions,
  HvwGame,
  HvwGymInfo,
} from '@svv/core/models';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

export interface GymInfoDialogData {
  game: HvwGame;
}

@Component({
  selector: 'gym-info',
  templateUrl: './gym-info.component.html',
  styleUrls: ['./gym-info.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class GymInfoComponent implements OnInit, OnDestroy {
  private readonly destroy$: Subject<void> = new Subject<void>();

  @Input() game: HvwGame;
  @Input() smallOpenGoogleMapsButton: boolean = false;
  @Input() width: string = '100%';
  @Input() height: string = '500px';

  @HostBinding('class') gymInfoClass = 'gym-info';

  gymInfo: HvwGymInfo;
  isBrowser: boolean;
  loading: boolean;

  center: GoogleMapsLatLng;
  markerPosition: GoogleMapsLatLng;
  markerOptions: GoogleMapsMarkerOptions = {
    draggable: false,
  };
  zoom: number = 17;

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: string,
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit() {
    this.loading = true;
    this.http
      .get('https://spo.handball4all.de/service/if_g_json.php', {
        params: {
          cmd: 'gi',
          g: String(this.game.gymnasium.id),
        },
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe(response => {
        this.gymInfo = response[0].gymnasiumInfo;

        const latLng = {
          lat: Number(this.gymInfo.geolat),
          lng: Number(this.gymInfo.geolon),
        };

        this.center = latLng;
        this.markerPosition = latLng;
        this.loading = false;
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get googleMapsURL() {
    let { name, street, town } = this.gymInfo;
    const query = encodeURIComponent(`${name},${street},${town}`);
    return `https://www.google.com/maps/search/?api=1&query=${query}`;
  }
}
