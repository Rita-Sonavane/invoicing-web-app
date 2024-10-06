import { AfterViewInit, Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/service/auth.service';
import { ProfileService } from 'src/app/service/profile.service';

@Component({
  selector: 'app-admin-component',
  templateUrl: './admin-component.component.html',
  styleUrls: ['./admin-component.component.css']
})
export class AdminComponentComponent implements AfterViewInit {


  constructor(
    private router: Router,
    private profileService: ProfileService,){

  }

  onBack(){
    this.router.navigate(['/dashboard'])
  }


  ngAfterViewInit() {
    const sidebar = document.querySelector('.sidebar') as HTMLElement;
    const closeBtn = document.getElementById('btn') as HTMLElement;
    const searchBtn = document.querySelector('.bx-search') as HTMLElement;
    const LogoutBtn = document.querySelector('#log_out') as HTMLElement;

    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        sidebar.classList.toggle('open');
        this.menuBtnChange(sidebar, closeBtn);
      });
    }

    if (searchBtn) {
      searchBtn.addEventListener('click', () => {
        sidebar.classList.toggle('open');
        this.menuBtnChange(sidebar, closeBtn);
      });
    }

    if (LogoutBtn) {
      LogoutBtn.addEventListener('click', () => {
        console.log("Logout Cliked");
        this.onBack();
      });
    }

  }



  menuBtnChange(sidebar: HTMLElement, closeBtn: HTMLElement) {
    if (sidebar.classList.contains('open')) {
      closeBtn.classList.remove('bx-menu');
      closeBtn.classList.add('bx-menu-alt-right');
    } else {
      closeBtn.classList.remove('bx-menu-alt-right');
      closeBtn.classList.add('bx-menu');
    }
  }
}
