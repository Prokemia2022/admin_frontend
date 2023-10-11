import axios from 'axios';
//import Cookies from 'universal-cookie';

export default async function Get_SalesPeople() {
    const env = process.env.NODE_ENV;

    const devbaseurl = process.env.NEXT_PUBLIC_DEV_BASEURL;
    const prodbaseurl = process.env.NEXT_PUBLIC_PROD_BASEURL;
  
    let base_url;
    if(env == "development"){
        base_url = devbaseurl;
    }else if(env == "production"){
        base_url = prodbaseurl;
    }
    const result = axios.get(`${base_url}/api/get_salesperson_accounts`)
    return result;
	// const env = process.env.NODE_ENV
    // console.log(env)
    // if(env == "development"){
    //     const result = await axios.get("http://localhost:5001/api/get_salesperson_accounts")
    // 	return result
    // }
    // else if (env == "production"){
    // 	const result = await axios.get("https://prokemia-adminserver-production.up.railway.app/api/get_salesperson_accounts")
    // 	return result
    // }
}