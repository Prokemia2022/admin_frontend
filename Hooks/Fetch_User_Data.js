import Get_Admin_User from '../pages/api/auth/get_admin_user';

const fetch_user_details=async(id)=>{
    const payload = {
        _id : id
    }
    await Get_Admin_User(payload).then((res)=>{
        console.log(res.data);
        const result = res.data;
        return result;
    }).catch((err)=>{
        if (err.response?.status == 500){
            return err;
        }
    })
}

export default fetch_user_details;