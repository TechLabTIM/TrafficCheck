import { Component, ElementRef, ViewChild, AfterViewInit, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements AfterViewInit, OnChanges {
  @ViewChild('googleMap', { static: false }) mapElement!: ElementRef;
  @Input() results: any[] = [];

  map!: google.maps.Map;
  markers: google.maps.Marker[] = [];

  ngAfterViewInit(): void {
    this.initializeMap();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['results'] && this.results && this.results.length > 0) {
      this.setMarkers();
    }
  }

  initializeMap(): void {
    const mapOptions: google.maps.MapOptions = {
      center: new google.maps.LatLng(-22.9068, -43.1729), // Default center on map initialization
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
  }

  setMarkers(): void {
    // Clear existing markers
    this.clearMarkers();

    // Assuming results is not empty and contains valid coordinates
    const bounds = new google.maps.LatLngBounds();

    this.results.forEach(result => {
      const position = new google.maps.LatLng(result.latitude, result.longitude);
      const marker = new google.maps.Marker({
        position: position,
        map: this.map,
        title: result.type
      });
      this.markers.push(marker);
      bounds.extend(position);
    });

    // Only re-center if there are results to show
    if (this.markers.length > 0) {
      this.map.fitBounds(bounds);  // Fit the map to the new marker bounds
    }
  }

  clearMarkers(): void {
    for (let marker of this.markers) {
      marker.setMap(null); // Remove the marker from the map
    }
    this.markers = []; // Clear the array of markers
  }
}
