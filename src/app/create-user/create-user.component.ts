import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.scss']
})
export class CreateUserComponent {
  'createUserForm' :  FormGroup  ;
  constructor(private fb :FormBuilder){
   this.createUserForm = this.fb.group({
    email : ['' , [Validators.required]],
    password : ['' , [Validators.required]],
    name :['' , [Validators.required]]
   })
  }

}
