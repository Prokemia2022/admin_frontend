import axios from 'axios';

export default async function Get_Applications(){
	const env = process.env.NODE_ENV
    console.log(env)
    if(env == "development"){
        const result = await axios.get("http://localhost:5001/api/get_applications")
    	return result
    }
    else if (env == "production"){
    	const result = await axios.get(`https://prokemia-adminserver-production.up.railway.app/api/get_applications`)
    	return result
    }
}