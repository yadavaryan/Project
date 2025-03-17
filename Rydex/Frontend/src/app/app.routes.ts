import { Routes } from '@angular/router';
import { CreateRideComponent } from './rides/create-ride/create-ride.component';
import { ConfirmRideComponent } from './rides/confirm-ride/confirm-ride.component';
import { RideHistoryComponent } from './rides/ride-history/ride-history.component';
import { ListComponent } from './driver/list/list.component';
import { RunningRequestComponent } from './driver/running-request/running-request.component';
import { CityComponent } from './pricing/city/city.component';
import { CountryComponent } from './pricing/country/country.component';
import { VehicalPricingComponent } from './pricing/vehical-pricing/vehical-pricing.component';
import { VehicalTypeComponent } from './pricing/vehical-type/vehical-type.component';
import { UserComponent } from './user/user.component';
import { SettingComponent } from './setting/setting.component';
import { RidesComponent } from './rides/rides.component';
import { LoginComponent } from './login/login.component';
import {  canActivateChildGuard, canActivateGuard } from './services/auth.guard';


export const routes: Routes = [

    {path:'auth',component:LoginComponent},
    {path:'',
        canActivate:[canActivateGuard],
        canActivateChild:[canActivateChildGuard],
        children: [
            {
                path: 'rides',
                children: [
                    {path: '', redirectTo: 'confirm' ,pathMatch: "full"}, 
                    {path: 'create',component: CreateRideComponent},
                    {path: 'confirm',component: ConfirmRideComponent},
                    {path: 'history',component: RideHistoryComponent},
                ]
            },
            {
                path: 'driver',
                children: [
                    {path: 'list',component: ListComponent},
                    {path: 'running',component: RunningRequestComponent},
                ]
            },
            {
                path: 'pricing',
                children: [
                    {path: 'city',component: CityComponent},
                    {path: 'country',component: CountryComponent},
                    {path: 'vehiclepricing',component: VehicalPricingComponent},
                    {path: 'vehicletype',component: VehicalTypeComponent}
        
                ]
            },
            { path: 'users', component: UserComponent },
            { path: 'settings', component: SettingComponent }
            
        ]
    }
   
    
];
