import axios from 'axios';
//import Cookies from 'universal-cookie';

export default async function Get_Products() {
    const result = await axios.get("http://localhost:5001/api/get_products")
    return result
}