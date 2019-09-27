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

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home/home.component';

import { ContractComponent } from './Contract/Contract.component';
import { ShipmentComponent } from './Shipment/Shipment.component';
import { LoaderComponent } from './Loader/Loader.component';
import { TemperatureDeviceComponent } from './TemperatureDevice/TemperatureDevice.component';
import { LocationDeviceComponent } from './LocationDevice/LocationDevice.component';

import { ManufacturerComponent } from './Manufacturer/Manufacturer.component';
import { ShipperComponent } from './Shipper/Shipper.component';
import { ImporterComponent } from './Importer/Importer.component';

import { SubmitIOTDataComponent } from './SubmitIOTData/SubmitIOTData.component';
import { ShipmentReceivedComponent } from './ShipmentReceived/ShipmentReceived.component';
import { LoadSeedsComponent } from './LoadSeeds/LoadSeeds.component';
import { PostNewsComponent } from './PostNews/PostNews.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'Contract', component: ContractComponent },
  { path: 'Shipment', component: ShipmentComponent },
  { path: 'Loader', component: LoaderComponent },
  { path: 'TemperatureDevice', component: TemperatureDeviceComponent },
  { path: 'LocationDevice', component: LocationDeviceComponent },
  { path: 'Manufacturer', component: ManufacturerComponent },
  { path: 'Shipper', component: ShipperComponent },
  { path: 'Importer', component: ImporterComponent },
  { path: 'SubmitIOTData', component: SubmitIOTDataComponent },
  { path: 'ShipmentReceived', component: ShipmentReceivedComponent },
  { path: 'LoadSeeds', component: LoadSeedsComponent },
  { path: 'PostNews', component: PostNewsComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
 imports: [RouterModule.forRoot(routes)],
 exports: [RouterModule],
 providers: []
})
export class AppRoutingModule { }
