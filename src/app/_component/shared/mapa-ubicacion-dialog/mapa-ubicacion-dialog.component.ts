import { Component, Inject } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import {
  MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA,
  MatLegacyDialogRef as MatDialogRef
} from '@angular/material/legacy-dialog';

export interface MapaUbicacionDialogData {
  direccion?: string;
  titulo: string;
  ubicacion?: string;
}

@Component({
  standalone: false,
  selector: 'app-mapa-ubicacion-dialog',
  template: `
    <h2 mat-dialog-title>{{ data.titulo }}</h2>
    <mat-dialog-content class="map-preview-content">
      @if (data.direccion) {
        <p class="map-preview-address">
          <mat-icon aria-hidden="true">place</mat-icon>
          {{ data.direccion }}
        </p>
      }
      <iframe
        class="map-preview-frame"
        [src]="mapaUrl"
        title="Vista previa de la ubicación"
        loading="lazy"
        referrerpolicy="no-referrer-when-downgrade"
      ></iframe>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <a
        mat-button
        color="primary"
        [href]="googleMapsUrl"
        target="_blank"
        rel="noopener noreferrer"
      >
        Abrir en Google Maps
      </a>
      <button mat-button type="button" (click)="dialogRef.close()">
        Cerrar
      </button>
    </mat-dialog-actions>
  `,
  styles: [
    `
      .map-preview-content {
        width: min(760px, 80vw);
      }
      .map-preview-address {
        display: flex;
        align-items: center;
        gap: 6px;
      }
      .map-preview-frame {
        width: 100%;
        height: min(55vh, 440px);
        border: 0;
        border-radius: 8px;
      }
      @media (max-width: 600px) {
        .map-preview-content {
          width: 82vw;
        }
      }
    `
  ]
})
export class MapaUbicacionDialogComponent {
  mapaUrl: SafeResourceUrl;
  googleMapsUrl: string;

  constructor(
    public dialogRef: MatDialogRef<MapaUbicacionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: MapaUbicacionDialogData,
    sanitizer: DomSanitizer
  ) {
    const consulta =
      this.extraerConsulta(data.ubicacion) || data.direccion || '';
    const consultaCodificada = encodeURIComponent(consulta);
    this.googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${consultaCodificada}`;
    this.mapaUrl = sanitizer.bypassSecurityTrustResourceUrl(
      `https://maps.google.com/maps?q=${consultaCodificada}&z=16&output=embed`
    );
  }

  private extraerConsulta(ubicacion?: string): string {
    if (!ubicacion) {
      return '';
    }

    const coincidencia = decodeURIComponent(ubicacion).match(
      /(?:[?&]q=|@)(-?\d{1,2}(?:\.\d+)?),(-?\d{1,3}(?:\.\d+)?)/
    );
    return coincidencia ? `${coincidencia[1]},${coincidencia[2]}` : '';
  }
}
