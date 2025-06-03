interface Users {
  id: number;
  name: string;
  username: string;
  email: string;
  address: Address;
  phone: string;
  website: string;
  company: Company;
}

interface Address {
  street: string;
  suite: string;
  city: string;
  zipcode: string;
  geo: Geo;
}

interface Geo {
  lat: string;
  lng: string;
}

interface Company {
  name: string;
  catchPhrase: string;
  bs: string;
}


function fetchData() {
  return fetch("https://jsonplaceholder.typicode.com/users")
    .then((res) => res.json())
    .then((json) => {
        return JSON.parse(JSON.stringify(json))
    });
}

export { fetchData, Users, Address, Geo, Company };
