import axios from 'axios';
//import Cookies from 'universal-cookie';

export default async function Add_vacancy(payload) {
    const result = await axios.post("http://localhost:5001/api/add_vacancy",payload)
    return result
}