import axios from 'axios';
import Cookies from 'universal-cookie';

export default async function SignIn(payload) {
    /**
     * Sends a post req to submit user credentials to verify user.
     * 
     * env (): state of project.
     * result (obj): json res containing the token and status from server.
     * 
     * Return :
     *      Returns the result to Authhandler.
     * 
     */
    const cookies = new Cookies();
	const env = process.env.NODE_ENV;

	const devbaseurl = process.env.NEXT_PUBLIC_DEV_BASEURL;
	const prodbaseurl = process.env.NEXT_PUBLIC_PROD_BASEURL;
  
	let base_url;
	if(env == "development"){
		base_url = devbaseurl;
	}else if(env == "production"){
		base_url = prodbaseurl;
	}
	const result = await axios.post(`${base_url}/api/signin`,payload);
    if(result.status === 201 || result.status === 500 ){
        return result
    }else{
        //console.log(result)
        cookies.set('admin_token', result.data, { path: '/' });
        return result
    }
    // const env = process.env.NODE_ENV
    // //console.log(env)
    // if(env == "development"){
    //     const end_point = process.env.DEV_API_ENDPOINT

    //     const cookies = new Cookies();
    //     const result = await axios.post(`http://localhost:5001/api/signin`,payload)
    //     if(result.status === 201 || result.status === 500 ){
    //         return result
    //     }else{
    //         //console.log(result.data)
    //         cookies.set('admin_token', result.data, { path: '/' });
    //         return result
    //     }
    // }
    // else if (env == "production"){
    //     const cookies = new Cookies();
    //     const result = await axios.post(`https://prokemia-adminserver-production.up.railway.app/api/signin`,payload)
    //     if(result.status === 201 || result.status === 500 ){
    //         return result
    //     }else{
    //         //console.log(result.data)
    //         cookies.set('admin_token', result.data, { path: '/' });
    //         return result
    //     }
    // }
}