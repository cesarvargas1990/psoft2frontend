import { MapaUbicacionDialogComponent } from './mapa-ubicacion-dialog.component';

describe('MapaUbicacionDialogComponent', () => {
  const dialogRef = { close: jasmine.createSpy('close') } as any;

  beforeEach(() => dialogRef.close.calls.reset());

  it('construye URLs seguras con coordenadas extraídas de Google Maps', () => {
    const component = new MapaUbicacionDialogComponent(dialogRef, {
      titulo: 'Casa',
      ubicacion: 'https://maps.google.com/?q=4.60971%2C-74.08175'
    });

    expect(component.googleMapsUrl).toBe(
      'https://www.google.com/maps/search/?api=1&query=4.60971%2C-74.08175'
    );
    expect(component.mapaUrl).toBe(
      'https://maps.google.com/maps?q=4.60971%2C-74.08175&z=16&output=embed'
    );
  });

  it('usa la dirección codificada cuando no hay coordenadas válidas', () => {
    const component = new MapaUbicacionDialogComponent(dialogRef, {
      titulo: 'Trabajo',
      ubicacion: 'javascript:alert(1)',
      direccion: 'Calle 10 # 20-30, Bogotá'
    });

    expect(component.googleMapsUrl).toContain(
      'query=Calle%2010%20%23%2020-30%2C%20Bogot%C3%A1'
    );
    expect(component.mapaUrl).toContain(
      'q=Calle%2010%20%23%2020-30%2C%20Bogot%C3%A1'
    );
    expect(component.mapaUrl.startsWith('https://maps.google.com/')).toBe(true);
  });

  it('genera una búsqueda vacía si no recibe ubicación ni dirección', () => {
    const component = new MapaUbicacionDialogComponent(dialogRef, {
      titulo: 'Ubicación'
    });

    expect(component.googleMapsUrl).toBe(
      'https://www.google.com/maps/search/?api=1&query='
    );
    expect(component.mapaUrl).toBe(
      'https://maps.google.com/maps?q=&z=16&output=embed'
    );
  });
});
