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
import { TemperatureDeviceService } from './TemperatureDevice.service';
import 'rxjs/add/operator/toPromise';

@Component({
  selector: 'app-temperaturedevice',
  templateUrl: './TemperatureDevice.component.html',
  styleUrls: ['./TemperatureDevice.component.css'],
  providers: [TemperatureDeviceService]
})
export class TemperatureDeviceComponent implements OnInit {

  myForm: FormGroup;

  private allAssets;
  private asset;
  private currentId;
  private errorMessage;

  DeviceId = new FormControl('', Validators.required);
  currentTemperature = new FormControl('', Validators.required);
  updatedOn = new FormControl('', Validators.required);

  constructor(public serviceTemperatureDevice: TemperatureDeviceService, fb: FormBuilder) {
    this.myForm = fb.group({
      DeviceId: this.DeviceId,
      currentTemperature: this.currentTemperature,
      updatedOn: this.updatedOn
    });
  };

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll(): Promise<any> {
    const tempList = [];
    return this.serviceTemperatureDevice.getAll()
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
      result.forEach(asset => {
        tempList.push(asset);
      });
      this.allAssets = tempList;
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

	/**
   * Event handler for changing the checked state of a checkbox (handles array enumeration values)
   * @param {String} name - the name of the asset field to update
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
   * only). This is used for checkboxes in the asset updateDialog.
   * @param {String} name - the name of the asset field to check
   * @param {any} value - the enumeration value to check for
   * @return {Boolean} whether the specified asset field contains the provided value
   */
  hasArrayValue(name: string, value: any): boolean {
    return this[name].value.indexOf(value) !== -1;
  }

  addAsset(form: any): Promise<any> {
    this.asset = {
      $class: 'org.rocket.shipping.TemperatureDevice',
      'DeviceId': this.DeviceId.value,
      'currentTemperature': this.currentTemperature.value,
      'updatedOn': this.updatedOn.value
    };

    this.myForm.setValue({
      'DeviceId': null,
      'currentTemperature': null,
      'updatedOn': null
    });

    return this.serviceTemperatureDevice.addAsset(this.asset)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
      this.myForm.setValue({
        'DeviceId': null,
        'currentTemperature': null,
        'updatedOn': null
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


  updateAsset(form: any): Promise<any> {
    this.asset = {
      $class: 'org.rocket.shipping.TemperatureDevice',
      'currentTemperature': this.currentTemperature.value,
      'updatedOn': this.updatedOn.value
    };

    return this.serviceTemperatureDevice.updateAsset(form.get('DeviceId').value, this.asset)
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


  deleteAsset(): Promise<any> {

    return this.serviceTemperatureDevice.deleteAsset(this.currentId)
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

    return this.serviceTemperatureDevice.getAsset(id)
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
      const formObject = {
        'DeviceId': null,
        'currentTemperature': null,
        'updatedOn': null
      };

      if (result.DeviceId) {
        formObject.DeviceId = result.DeviceId;
      } else {
        formObject.DeviceId = null;
      }

      if (result.currentTemperature) {
        formObject.currentTemperature = result.currentTemperature;
      } else {
        formObject.currentTemperature = null;
      }

      if (result.updatedOn) {
        formObject.updatedOn = result.updatedOn;
      } else {
        formObject.updatedOn = null;
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
      'DeviceId': null,
      'currentTemperature': null,
      'updatedOn': null
      });
  }

}
