import axios from 'axios';

export default async function Send_Sample_Email(payload) {
    const env = process.env.NODE_ENV;

    const devbaseurl = process.env.NEXT_PUBLIC_DEV_EMAIL_BASEURL;
    const prodbaseurl = process.env.NEXT_PUBLIC_PROD_EMAIL_BASEURL;
  
    let base_url;
    if(env == "development"){
        base_url = devbaseurl;
    }else if(env == "production"){
        base_url = prodbaseurl;
    }
    const result = axios.post(`${base_url}/api/sample_email`,payload)
    return result;
	// const env = process.env.NODE_ENV
    // //console.log(env)
    // if(env == "development"){
    //     const result = await axios.post(" http://localhost:5001/api/sample_email",payload)
    // 	return result
    // }
    // else if (env == "production"){
    // 	const result = await axios.post(`https://prokemiaemailsmsserver-production.up.railway.app/api/sample_email`,payload)
    // 	return result
    // }
}