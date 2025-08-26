export interface LoginResponse {
    id: string;
    email?: string;
    name?: string; 
    token?: string;
  }

export interface DataReponse<T> {
  status: number;
  message: string;
  data: T;
}

export interface TripsModel {
    id:            number;
    isReserved?:   boolean;
    price:         number;
    currency:      string;
    departureTime: string;
    arrivalTime:   string;
    numberOfSeats: number;
    fromCity:      City;
    toCity:        City;
    car:           Car;
    passengers:    Passenger[];
}

export interface Car {
    id:          number;
    plateNumber: string;
    driver:      Driver;
}

export interface Driver {
    id:             number;
    liecenceNumber: string;
    user:           Passenger;
}

export interface Passenger {
    id:    number;
    name:  string;
    phone: string;
    email: string;
    city?: City;
    image: string;
}

export interface City {
    id:   number;
    name: string;
    longitude: number,
    latitude: number,

}