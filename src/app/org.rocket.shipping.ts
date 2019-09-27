import {Asset} from './org.hyperledger.composer.system';
import {Participant} from './org.hyperledger.composer.system';
import {Transaction} from './org.hyperledger.composer.system';
import {Event} from './org.hyperledger.composer.system';
// export namespace org.rocket.shipping{
   export abstract class Business extends Participant {
      email: string;
      name: string;
      accountBalance: number;
      address: string;
      rating: string;
      VolationCount: string;
      DeliveryCount: string;
   }
   export class Address {
      zip: string;
      city: string;
      state: string;
      country: string;
   }
   export class Manufacturer extends Business {
   }
   export class Shipper extends Business {
   }
   export class Importer extends Business {
   }
   export class Contract extends Asset {
      contractId: string;
      shipper: Shipper;
      manufacturer: Manufacturer;
      importer: Importer;
      unitPrice: number;
      arrivalDateTime: Date;
      minimumTemperature: number;
      maximumTemperature: number;
      minimumTemperatureViolationFinePerUnit: number;
      maximumTemperatureViolationFinePerUnit: number;
      delayViolationFine: number;
   }
   export class Shipment extends Asset {
      ShipmentId: string;
      productType: ProductType;
      ShipmentStatus: ShipmentStatus;
      temperatureRecords: TemperatureRecord[];
      trackingRecords: TrackingRecord[];
      unitCount: number;
      contract: Contract;
      loader: Loader;
   }
   export class Loader extends Asset {
      LoaderId: string;
      temperatureDevice: TemperatureDevice;
      locationDevice: LocationDevice;
   }
   export class TemperatureDevice extends Asset {
      DeviceId: string;
      currentTemperature: string;
      updatedOn: Date;
   }
   export class LocationDevice extends Asset {
      DeviceId: string;
      currentLatitude: string;
      currentLongitude: string;
      updatedOn: Date;
   }
   export enum ProductType {
      Fruit,
      Meat,
      Cosmatic,
      FrozenItems,
   }
   export enum ShipmentStatus {
      Created,
      InTransit,
      Arrived,
   }
   export class TemperatureRecord {
      centigrade: number;
      deviceId: string;
   }
   export class TrackingRecord {
      longitude: string;
      latitude: string;
      deviceId: string;
   }
   export class IOTMessage {
      DeviceId: string;
      Type: string;
      Value: string;
   }
   export abstract class ShipmentTransaction extends Transaction {
      shipment: Shipment;
   }
   export class SubmitIOTData extends Transaction {
      payload: string;
   }
   export class ShipmentReceived extends ShipmentTransaction {
   }
   export class LoadSeeds extends Transaction {
   }
   export class PostNews extends Transaction {
      news: string;
   }
   export class TrackingEvent extends Event {
      shipment: Shipment;
      trackingRecords: TrackingRecord[];
   }
   export class BroadCastNews extends Event {
      news: string;
   }
   export class ShipmentStatusCommunicator extends Event {
      shipment: Shipment;
      ShipmentStatus: ShipmentStatus;
   }
// }
