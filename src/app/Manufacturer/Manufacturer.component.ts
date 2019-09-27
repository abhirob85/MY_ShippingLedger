/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { ManufacturerService } from './Manufacturer.service';
import 'rxjs/add/operator/toPromise';

@Component({
  selector: 'app-manufacturer',
  templateUrl: './Manufacturer.component.html',
  styleUrls: ['./Manufacturer.component.css'],
  providers: [ManufacturerService]
})
export class ManufacturerComponent implements OnInit {

  myForm: FormGroup;

  private allParticipants;
  private participant;
  private currentId;
  private errorMessage;

  email = new FormControl('', Validators.required);
  name = new FormControl('', Validators.required);
  accountBalance = new FormControl('', Validators.required);
  address = new FormControl('', Validators.required);
  rating = new FormControl('', Validators.required);
  VolationCount = new FormControl('', Validators.required);
  DeliveryCount = new FormControl('', Validators.required);


  constructor(public serviceManufacturer: ManufacturerService, fb: FormBuilder) {
    this.myForm = fb.group({
      email: this.email,
      name: this.name,
      accountBalance: this.accountBalance,
      address: this.address,
      rating: this.rating,
      VolationCount: this.VolationCount,
      DeliveryCount: this.DeliveryCount
    });
  };

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll(): Promise<any> {
    const tempList = [];
    return this.serviceManufacturer.getAll()
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
      result.forEach(participant => {
        tempList.push(participant);
      });
      this.allParticipants = tempList;
    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else if (error === '404 - Not Found') {
        this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
        this.errorMessage = error;
      }
    });
  }

	/**
   * Event handler for changing the checked state of a checkbox (handles array enumeration values)
   * @param {String} name - the name of the participant field to update
   * @param {any} value - the enumeration value for which to toggle the checked state
   */
  changeArrayValue(name: string, value: any): void {
    const index = this[name].value.indexOf(value);
    if (index === -1) {
      this[name].value.push(value);
    } else {
      this[name].value.splice(index, 1);
    }
  }

	/**
	 * Checkbox helper, determining whether an enumeration value should be selected or not (for array enumeration values
   * only). This is used for checkboxes in the participant updateDialog.
   * @param {String} name - the name of the participant field to check
   * @param {any} value - the enumeration value to check for
   * @return {Boolean} whether the specified participant field contains the provided value
   */
  hasArrayValue(name: string, value: any): boolean {
    return this[name].value.indexOf(value) !== -1;
  }

  addParticipant(form: any): Promise<any> {
    this.participant = {
      $class: 'org.rocket.shipping.Manufacturer',
      'email': this.email.value,
      'name': this.name.value,
      'accountBalance': this.accountBalance.value,
      'address': this.address.value,
      'rating': this.rating.value,
      'VolationCount': this.VolationCount.value,
      'DeliveryCount': this.DeliveryCount.value
    };

    this.myForm.setValue({
      'email': null,
      'name': null,
      'accountBalance': null,
      'address': null,
      'rating': null,
      'VolationCount': null,
      'DeliveryCount': null
    });

    return this.serviceManufacturer.addParticipant(this.participant)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
      this.myForm.setValue({
        'email': null,
        'name': null,
        'accountBalance': null,
        'address': null,
        'rating': null,
        'VolationCount': null,
        'DeliveryCount': null
      });
      this.loadAll(); 
    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else {
        this.errorMessage = error;
      }
    });
  }


   updateParticipant(form: any): Promise<any> {
    this.participant = {
      $class: 'org.rocket.shipping.Manufacturer',
      'name': this.name.value,
      'accountBalance': this.accountBalance.value,
      'address': this.address.value,
      'rating': this.rating.value,
      'VolationCount': this.VolationCount.value,
      'DeliveryCount': this.DeliveryCount.value
    };

    return this.serviceManufacturer.updateParticipant(form.get('email').value, this.participant)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
      this.loadAll();
    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else if (error === '404 - Not Found') {
        this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
      } else {
        this.errorMessage = error;
      }
    });
  }


  deleteParticipant(): Promise<any> {

    return this.serviceManufacturer.deleteParticipant(this.currentId)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
      this.loadAll();
    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else if (error === '404 - Not Found') {
        this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
      } else {
        this.errorMessage = error;
      }
    });
  }

  setId(id: any): void {
    this.currentId = id;
  }

  getForm(id: any): Promise<any> {

    return this.serviceManufacturer.getparticipant(id)
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
      const formObject = {
        'email': null,
        'name': null,
        'accountBalance': null,
        'address': null,
        'rating': null,
        'VolationCount': null,
        'DeliveryCount': null
      };

      if (result.email) {
        formObject.email = result.email;
      } else {
        formObject.email = null;
      }

      if (result.name) {
        formObject.name = result.name;
      } else {
        formObject.name = null;
      }

      if (result.accountBalance) {
        formObject.accountBalance = result.accountBalance;
      } else {
        formObject.accountBalance = null;
      }

      if (result.address) {
        formObject.address = result.address;
      } else {
        formObject.address = null;
      }

      if (result.rating) {
        formObject.rating = result.rating;
      } else {
        formObject.rating = null;
      }

      if (result.VolationCount) {
        formObject.VolationCount = result.VolationCount;
      } else {
        formObject.VolationCount = null;
      }

      if (result.DeliveryCount) {
        formObject.DeliveryCount = result.DeliveryCount;
      } else {
        formObject.DeliveryCount = null;
      }

      this.myForm.setValue(formObject);
    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else if (error === '404 - Not Found') {
        this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
      } else {
        this.errorMessage = error;
      }
    });

  }

  resetForm(): void {
    this.myForm.setValue({
      'email': null,
      'name': null,
      'accountBalance': null,
      'address': null,
      'rating': null,
      'VolationCount': null,
      'DeliveryCount': null
    });
  }
}
