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
import { ShipmentService } from './Shipment.service';
import 'rxjs/add/operator/toPromise';

@Component({
  selector: 'app-shipment',
  templateUrl: './Shipment.component.html',
  styleUrls: ['./Shipment.component.css'],
  providers: [ShipmentService]
})
export class ShipmentComponent implements OnInit {

  myForm: FormGroup;

  private allAssets;
  private asset;
  private currentId;
  private errorMessage;

  ShipmentId = new FormControl('', Validators.required);
  productType = new FormControl('', Validators.required);
  ShipmentStatus = new FormControl('', Validators.required);
  temperatureRecords = new FormControl('', Validators.required);
  trackingRecords = new FormControl('', Validators.required);
  unitCount = new FormControl('', Validators.required);
  contract = new FormControl('', Validators.required);
  loader = new FormControl('', Validators.required);

  constructor(public serviceShipment: ShipmentService, fb: FormBuilder) {
    this.myForm = fb.group({
      ShipmentId: this.ShipmentId,
      productType: this.productType,
      ShipmentStatus: this.ShipmentStatus,
      temperatureRecords: this.temperatureRecords,
      trackingRecords: this.trackingRecords,
      unitCount: this.unitCount,
      contract: this.contract,
      loader: this.loader
    });
  };

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll(): Promise<any> {
    const tempList = [];
    return this.serviceShipment.getAll()
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
      $class: 'org.rocket.shipping.Shipment',
      'ShipmentId': this.ShipmentId.value,
      'productType': this.productType.value,
      'ShipmentStatus': this.ShipmentStatus.value,
      'temperatureRecords': this.temperatureRecords.value,
      'trackingRecords': this.trackingRecords.value,
      'unitCount': this.unitCount.value,
      'contract': 'org.rocket.shipping.Contract#'+this.contract.value,
      'loader':'org.rocket.shipping.Loader#'+ this.loader.value
    };

    this.myForm.setValue({
      'ShipmentId': null,
      'productType': null,
      'ShipmentStatus': null,
      'temperatureRecords': null,
      'trackingRecords': null,
      'unitCount': null,
      'contract': null,
      'loader': null
    });

    return this.serviceShipment.addAsset(this.asset)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
      this.myForm.setValue({
        'ShipmentId': null,
        'productType': null,
        'ShipmentStatus': null,
        'temperatureRecords': null,
        'trackingRecords': null,
        'unitCount': null,
        'contract': null,
        'loader': null
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
      $class: 'org.rocket.shipping.Shipment',
      'productType': this.productType.value,
      'ShipmentStatus': this.ShipmentStatus.value,
      'temperatureRecords': this.temperatureRecords.value,
      'trackingRecords': this.trackingRecords.value,
      'unitCount': this.unitCount.value,
      'contract': this.contract.value,
      'loader': this.loader.value
    };

    return this.serviceShipment.updateAsset(form.get('ShipmentId').value, this.asset)
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

    return this.serviceShipment.deleteAsset(this.currentId)
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

    return this.serviceShipment.getAsset(id)
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
      const formObject = {
        'ShipmentId': null,
        'productType': null,
        'ShipmentStatus': null,
        'temperatureRecords': null,
        'trackingRecords': null,
        'unitCount': null,
        'contract': null,
        'loader': null
      };

      if (result.ShipmentId) {
        formObject.ShipmentId = result.ShipmentId;
      } else {
        formObject.ShipmentId = null;
      }

      if (result.productType) {
        formObject.productType = result.productType;
      } else {
        formObject.productType = null;
      }

      if (result.ShipmentStatus) {
        formObject.ShipmentStatus = result.ShipmentStatus;
      } else {
        formObject.ShipmentStatus = null;
      }

      if (result.temperatureRecords) {
        formObject.temperatureRecords = result.temperatureRecords;
      } else {
        formObject.temperatureRecords = null;
      }

      if (result.trackingRecords) {
        formObject.trackingRecords = result.trackingRecords;
      } else {
        formObject.trackingRecords = null;
      }

      if (result.unitCount) {
        formObject.unitCount = result.unitCount;
      } else {
        formObject.unitCount = null;
      }

      if (result.contract) {
        formObject.contract = result.contract;
      } else {
        formObject.contract = null;
      }

      if (result.loader) {
        formObject.loader = result.loader;
      } else {
        formObject.loader = null;
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
      'ShipmentId': null,
      'productType': null,
      'ShipmentStatus': null,
      'temperatureRecords': null,
      'trackingRecords': null,
      'unitCount': null,
      'contract': null,
      'loader': null
      });
  }

}
