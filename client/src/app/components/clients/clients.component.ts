import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/service/auth.service';
import { ClientService } from 'src/app/service/client.service';
import { CustomerService } from 'src/app/service/customer.service';
import { ProfileService } from 'src/app/service/profile.service';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.css']
})
export class ClientsComponent implements OnInit {
  selectedClient: any
  customers: any[] = [];
  clients: any[] = []

  constructor(private authService: AuthService,
    private router: Router,
    private profileService: ProfileService,
    private customerService: CustomerService,
    private clientService: ClientService) { }



  onSelectClient(client: any): void {
    this.clientService.selectClient(client);
    this.router.navigate(['/admin/client-customer']);
  }


  ngOnInit(): void {
    this.fetchClients();
  }




  fetchClients(): void {
    this.profileService.getProfiles().subscribe(
      (response) => {
        console.error('Data :', response);
        this.clients = response;

      },
      (error) => {
        console.error('Error fetching customers:', error);
      }
    );
  }

}
