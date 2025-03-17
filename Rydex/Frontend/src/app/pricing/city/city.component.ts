import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { CountryService } from '../../services/country.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GoogleMapsModule } from '@angular/google-maps';
import { CityService } from '../../services/city.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-city',
  standalone: true,
  imports: [CommonModule, FormsModule, GoogleMapsModule],
  templateUrl: './city.component.html',
  styleUrl: './city.component.css',
})
export class CityComponent {
  countryservice: CountryService = inject(CountryService);
  cityservice: CityService = inject(CityService);
  private toastr = inject(ToastrService);

  countryname: any[] = [];
  country: any[] = [];
  selectedCountry: string = '';
  selectedcity: string = '';
  getcity: string = '';
  @ViewChild('searchcity') search!: ElementRef;
  city!: google.maps.places.PlaceResult;
  countrycode!: string;
  map!: google.maps.Map;
  paths: any;
  coordinates: any[] = [];
  allcity: any[] = [];
  cityarray: any[] = [];
  showpolygonpath: any;
  drawingManager: any;
  drawpolygon: any;
  savedpolygon: any;
  editing!: boolean;

  ngOnInit() {
    this.getcountry();
    this.getallcities();
  }

  ngAfterViewInit() {
    this.initmap();
  }

  onCountryChange() {
    console.log('Selected country:', this.selectedCountry);
    this.country = this.countryname.filter((country) => country.countryname === this.selectedCountry);
    this.countrycode = this.country[0].countrycode;
    this.initautocomplete();
    this.initDrawingManager();
    if (this.selectedCountry) {
      this.allcity = this.cityarray.filter((item) => item.city.toLowerCase().includes(this.selectedCountry.toLowerCase()));
      console.log(this.allcity);
    }
  }

  getcountry() {
    this.countryservice.getallcountries().subscribe({
      next: (data: any) => {
        this.countryname = data;
        this.toastr.success('Countries fetched successfully', 'Success');
      },
      error: () => {
        this.toastr.error('Failed to fetch countries', 'Error');
      },
    });
  }

  savepolygone() {
    if (this.editing) {
      this.cityservice.updatepolygon(this.coordinates, this.getcity).subscribe({
        next: () => {
          this.toastr.success('Polygon updated successfully', 'Success');
        },
        error: () => {
          this.toastr.error('Failed to update polygon', 'Error');
        },
      });
    }
    console.log(this.getcity);
    const citydata = {
      country: this.country[0].countryname,
      city: this.city.formatted_address,
      coordinates: this.coordinates,
    };
    this.cityservice.savepolygon(citydata).subscribe({
      next: () => {
        this.toastr.success('Polygon saved successfully', 'Success');
      },
      error: () => {
        this.toastr.error('Failed to save polygon', 'Error');
      },
    });
    this.getpolygon();
    setTimeout(() => {
      this.showpolygone();
    }, 300);
  }

  initmap() {
    const mapDiv = document.getElementById('map');
    if (!mapDiv) {
      console.error('Map container not found!');
      this.toastr.error('Failed to initialize map container', 'Error');
      return;
    }

    this.map = new google.maps.Map(mapDiv, {
      zoom: 11,
      center: { lat: 22.3087, lng: 70.7989 },
    });

  }

  initautocomplete() {
    if (!this.search?.nativeElement) {
      console.error('Search input not found!');
      this.toastr.error('Search input not found', 'Error');
      return;
    }

    const options = {
      types: ['(cities)'],
      componentRestrictions: { country: this.countrycode },
    };
    const autocomplete = new google.maps.places.Autocomplete(this.search.nativeElement, options);
    autocomplete.addListener('place_changed', () => {
      this.city = autocomplete.getPlace();
      if (!this.city.geometry || !this.city.geometry.location) {
        console.error('Autocomplete returned place with no geometry or location.');
        this.toastr.error('Invalid place selected', 'Error');
        return;
      }
      const existcity = this.allcity.filter((item) => item.city.includes(this.city.formatted_address));
      if (existcity.length) {
        this.toastr.error('This city already exists', 'Error');
        return;
      }
      this.map.setCenter(this.city.geometry.location);
      console.log(this.city.geometry.location);
      this.getpolygon();
      this.toastr.success('City selected successfully', 'Success');
    });
  }

  initDrawingManager() {
    this.drawingManager = new google.maps.drawing.DrawingManager({
      drawingMode: google.maps.drawing.OverlayType.POLYGON,
      drawingControl: true,
      drawingControlOptions: {
        position: google.maps.ControlPosition.TOP_CENTER,
        drawingModes: [google.maps.drawing.OverlayType.POLYGON],
      },
      polygonOptions: {
        fillColor: '#FF0000',
        fillOpacity: 0.5,
        strokeWeight: 2,
        editable: true,
        zIndex: 1,
        draggable: true,
      },
    });

    this.drawingManager.setMap(this.map);

    google.maps.event.addListener(this.drawingManager, 'overlaycomplete', (event: { type: string; overlay: google.maps.Polygon }) => {
      if (event.type === 'polygon') {
        this.drawpolygon = event.overlay as google.maps.Polygon;
        console.log('Polygon created!');

        this.paths = this.drawpolygon.getPath();
        this.paths.forEach((latLng: any) => {
          this.coordinates.push([latLng.lat(), latLng.lng()]);
        });

        google.maps.event.addListener(this.paths, 'set_at', () => {
          this.updatecoordinate();
        });

        google.maps.event.addListener(this.paths, 'insert_at', () => {
          this.updatecoordinate();
        });

        google.maps.event.addListener(this.paths, 'remove_at', () => {
          this.updatecoordinate();
        });

      }
    });
  }

  getpolygon() {
    this.cityservice.getpolygon(this.getcity ? this.getcity : this.city.formatted_address).subscribe({
      next: (data: any) => {
        console.log(data);
        this.showpolygonpath = data;
      },
      error: () => {
        this.toastr.error('Failed to fetch polygon data', 'Error');
      },
    });
    setTimeout(() => {
      this.showpolygone();
    }, 300);
  }

  showpolygone() {
    if (this.drawpolygon) {
      this.drawpolygon.setMap(null);
    }
    const formattedCoordinates = this.showpolygonpath[0].geometry.coordinates[0].map(([lat, lng]: any) => ({
      lat,
      lng,
    }));

    this.savedpolygon = new google.maps.Polygon({
      paths: formattedCoordinates,
      editable: true,
      fillColor: '#00FF00',
      fillOpacity: 0.5,
      strokeWeight: 2,
    });
    this.paths = this.savedpolygon.getPath();

    this.savedpolygon.setMap(this.map);
    this.map.setCenter(formattedCoordinates[0]);

    google.maps.event.addListener(this.paths, 'set_at', () => {
      this.updatecoordinate();
    });

    google.maps.event.addListener(this.paths, 'insert_at', () => {
      this.updatecoordinate();
    });

    google.maps.event.addListener(this.paths, 'remove_at', () => {
      this.updatecoordinate();
    });

    this.toastr.success('Polygon displayed successfully', 'Success');
  }

  getallcities() {
    this.cityservice.getallcities().subscribe({
      next: (data: any) => {
        this.allcity = data;
        this.cityarray = data;
        console.log(this.allcity);
        this.toastr.success('Cities fetched successfully', 'Success');
      },
      error: () => {
        this.toastr.error('Failed to fetch cities', 'Error');
      },
    });
  }

  onclickcity(city: string) {
    this.getcity = city;
    const cityname = city.split(',')[0];
    const countryarray = city.split(',');
    const length = countryarray.length;
    const countryname = countryarray[length - 1].trim();
    this.selectedCountry = countryname;
    this.selectedcity = cityname;
    if (this.savedpolygon) {
      this.savedpolygon.setMap(null);
    }
    this.getpolygon();
    this.editing = true;
  }

  updatecoordinate() {
    this.paths = this.paths.getArray().map((latlng: any) => ({
      lat: latlng.lat(),
      lng: latlng.lng(),
    }));
    this.coordinates = [];
    this.paths.forEach((latLng: any) => {
      this.coordinates.push([latLng.lat, latLng.lng]);
    });
    console.log('Updated Paths:', this.coordinates);
    this.toastr.success('Polygon coordinates updated successfully', 'Success');
  }
}

