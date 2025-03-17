import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-ride-details',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './ride-details.component.html',
  styleUrl: './ride-details.component.css'
})
export class RideDetailsComponent {
  @Input() isOpen: boolean = false;
  @Input() rideDetails!: any;
  @Output() onClose = new EventEmitter<void>();
  @ViewChild('mapContainer', { static: false }) mapContainer!: ElementRef;

  private map!: google.maps.Map;
  private geocoder!: google.maps.Geocoder;

  // ngOnInit() {
  //   if (this.isOpen) {
  //     setTimeout(() => {
  //       this.initializeMap();
  //     }, 0);
  //   }
  // }

  ngOnChanges(changes: any) {
    if (changes.isOpen && changes.isOpen.currentValue) {
      setTimeout(() => {
        this.initializeMap();
      }, 0);
    }
  }

  private async initializeMap() {
    if (!this.mapContainer) return;

    this.geocoder = new google.maps.Geocoder();

    this.map = new google.maps.Map(this.mapContainer.nativeElement, {
      zoom: 8,
    });

    await this.drawRoute();
  }

  private async drawRoute() {
    try {
      const pickupLocation = await this.geocodeAddress(this.rideDetails.pickup);
      const dropLocation = await this.geocodeAddress(this.rideDetails.drop);

      new google.maps.Marker({
        position: pickupLocation,
        map: this.map,
      });

      new google.maps.Marker({
        position: dropLocation,
        map: this.map,
      });

      const polyline = new google.maps.Polyline({
        path: [pickupLocation, dropLocation],
        geodesic: true,
        strokeColor: '#124559',
        strokeOpacity: 1.0,
        strokeWeight: 3
      });

      polyline.setMap(this.map);

      const bounds = new google.maps.LatLngBounds();
      bounds.extend(pickupLocation);
      bounds.extend(dropLocation);
      this.map.fitBounds(bounds);


    } catch (error) {
      console.error('Error drawing route:', error);
    }
  }

  private geocodeAddress(address: string): Promise<google.maps.LatLng> {
    return new Promise((resolve, reject) => {
      this.geocoder.geocode({ address }, (results, status) => {
        if (status === 'OK' && results && results[0]) {
          const location = results[0].geometry.location;
          resolve(location);
        } else {
          reject(new Error('Geocoding failed'));
        }
      });
    });
  }

}
