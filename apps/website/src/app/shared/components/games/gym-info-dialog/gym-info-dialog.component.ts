import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import {
  Component,
  Inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
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
  selector: 'gym-info-dialog',
  templateUrl: './gym-info-dialog.component.html',
  styleUrls: ['./gym-info-dialog.component.scss'],
})
export class GymInfoDialog implements OnInit, OnDestroy {
  private readonly destroy$: Subject<void> = new Subject<void>();

  gymInfo: HvwGymInfo;
  isBrowser: boolean;
  loading: boolean;

  center: GoogleMapsLatLng;
  zoom: number = 17;
  markerOptions: GoogleMapsMarkerOptions = {
    draggable: false,
  };
  markerPosition: GoogleMapsLatLng;

  constructor(
    private http: HttpClient,
    private dialogRef: MatDialogRef<GymInfoDialog>,
    @Inject(PLATFORM_ID) private platformId: string,
    @Inject(MAT_DIALOG_DATA) private data: GymInfoDialogData,
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

  close() {
    this.dialogRef.close();
  }

  get game() {
    return this.data.game;
  }
}
