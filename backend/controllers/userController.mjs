import { addUser,getUser } from '../models/user.mjs';


export async function create(req,res) {
    
    let errors = validate(req.body)

    if(Object.keys(errors).length>0){
        return res.status(400).json(errors)
    }

   let resullt = await addUser(req.body)
    res.status(201).send(resullt)
}

export async function login(req,res) {
    let user  = await getUser(req.body.email)
    if(user ){
        if(req.body.password == user[0].password){
            req.session.user = {id:user[0].id,name:user[0].name,email:user[0].email}
           return res.send(req.session.user)
        }
    }
    return res.status(400).json({error:"البريد الإلكتروني أو كلمة المرور غير صحيحة"})
}

function validate(data){
    //validate the inputs (correct format of email, strong password, no empty attributes)
    let validate = {}
    
    const emailRegex = /^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if( data.email &&  data.name &&  data.password &&  data.repeatPass){

        if(data.password !== data.repeatPass) validate.matchPass= "كلمات المرور غير متطابقة"
        if(!emailRegex.test(data.email)) validate.email="البريد الإلكتروني غير صحيح"
        if(!passwordRegex.test(data.password)) validate.weekPass="يجب أن تكون كلمة المرور مكونة من 8 أحرف على الأقل وتشمل حرفًا كبيرًا، حرفًا صغيرًا، رقمًا، ورمزًا خاصًا."
        return validate          
    }

    else{
         validate.missingInfo="معلومات مطلوبة مفقودة"
        return validate 
    }
    
}   

