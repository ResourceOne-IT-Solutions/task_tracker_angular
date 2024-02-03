import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ChatService } from 'src/app/services/chat.service';

@Component({
  selector: 'app-clientdescription',
  templateUrl: './clientdescription.component.html',
  styleUrls: ['./clientdescription.component.scss']
})
export class ClientdescriptionComponent {
  description: any;
  paramId: any;
  constructor(private chatservice: ChatService, private route: ActivatedRoute, private location: Location) { }
  ngOnInit() {
    this.paramId = this.route.snapshot.paramMap.get('id');
    console.log(this.paramId, '16::::')
    this.chatservice.get(`/tickets/${this.paramId}`).subscribe((res: any) => {
      this.description = res;
      console.log(this.description, '19999')
    })
  }
  getaddonResource() {
    const desc = this.description.addOnResource
    if (desc) {
      return desc.map((val: any) => val.name).join(',')
    }
  }
  ClientUpdates() {
    const update = this.description.updates
    if (update) {
      return update.map((val: any) => val)
    }
  }
  goback() {
    this.location.back()
  }
}
