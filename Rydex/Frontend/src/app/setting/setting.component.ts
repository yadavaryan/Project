import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SettingService } from '../services/setting.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-setting',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './setting.component.html',
  styleUrl: './setting.component.css'
})
export class SettingComponent {
  Seconds!: number; 
  Stops!: number; 
  private toastr = inject(ToastrService);

  
  settingservice: SettingService = inject(SettingService);

  ngOnInit(): void {
    this.getsetting();
  }

  Setting(){
   const data = {
      seconds:this.Seconds,
      stops:this.Stops
    };
    console.log(data)
    this.savesetting(data);
  }

  savesetting(data:any){
    this.settingservice.savesettings(data).subscribe({next: ()=> {
      console.log('settings saved')
      this.toastr.success('Settings Updated', 'Success');
    }})
  }
  getsetting(){
    this.settingservice.getsetting().subscribe({next: (data:any) =>{
      console.log(data);
      this.Seconds = data[0].seconds;
      this.Stops = data[0].stops;
      this.toastr.success('Settings fetched successfully', 'Success');
    }})
  }

}


