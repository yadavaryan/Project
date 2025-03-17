import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'countrysearch',
  standalone: true
})
export class CountrysearchPipe implements PipeTransform {

  transform(countries:any[],searchquery:string): any[] {
    
    if(!countries || !searchquery){
      return countries
    }else{
      let search = searchquery.toLowerCase();
      return countries.filter(country => country.countryname.toLowerCase().includes(search));
    }
    
  }

}
