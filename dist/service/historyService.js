import { v4 as uuidv4 } from 'uuid';
import fs from 'node:fs/promises';
// TODO: Define a City class with name and id properties
class City {
    constructor(name) {
        this.name = name,
            this.id = uuidv4();
    }
}
// TODO: Complete the HistoryService class
class HistoryService {
    constructor() {
    }
    // TODO: Define a read method that reads from the searchHistory.json file
    async read() {
        const history = await fs.readFile(`db/searchHistory.json`, 'utf8');
        return history;
    }
    // TODO: Define a write method that writes the updated cities array to the searchHistory.json file
    async write(cities) {
        await fs.writeFile(`db/searchHistory.json`, JSON.stringify(cities));
        return;
    }
    // TODO: Define a getCities method that reads the cities from the searchHistory.json file and returns them as an array of City objects
    async getCities() {
        try {
            const history = await JSON.parse(await this.read());
            return history;
        }
        catch (error) {
            console.error(`there was an error reading the json`);
            const history = [];
            return history;
        }
    }
    // TODO Define an addCity method that adds a city to the searchHistory.json file
    async addCity(city) {
        const cities = await this.getCities();
        const index = cities.findIndex((cities) => cities.name.toLowerCase() === city.toLowerCase());
        if (index === -1) {
            const newCity = new City(city);
            cities.push(newCity);
            this.write(cities);
        }
        return;
    }
    // * BONUS TODO: Define a removeCity method that removes a city from the searchHistory.json file
    async removeCity(id) {
        const cities = await this.getCities();
        const index = cities.findIndex((city) => city.id === id);
        if (index !== -1) {
            cities.splice(index, 1);
        }
        console.log(`city deleted`);
        await this.write(cities);
        return;
    }
}
export default new HistoryService();
