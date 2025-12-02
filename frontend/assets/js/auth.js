if(localStorage.getItem('user')){
    window.location.href = "./index.html"
    console.log("yse")
}

function clearErrors(errors){
    let keys = Object.keys(errors)
    keys.forEach(key=>{
        document.getElementById(`${key}`).innerHTML = ``
    })
}
function renderErrors(errors){

    let keys = Object.keys(errors)
    keys.forEach(key=>{
        document.getElementById(`${key}`).innerHTML = `*${errors[key]}`
    })
}
 

if (document.getElementById('registerForm')) {
    let form = document.getElementById('registerForm')
    form.onsubmit =  async e => {
        e.preventDefault();
         
        const formData = new FormData(form)
        const data =   Object.fromEntries(formData)
    
        
       let response = await fetch("http://localhost:4000/api/user",
            {
                method:'POST',
                headers:{
                    'Content-Type':'application/json'
                },
                body:JSON.stringify(data)
            }
        )
    let result = await response.json()
     let errors = {
        error:'',
        email:'',
        weekPass:'',
        matchPass:''
    }
    clearErrors(errors)
    if(result.message){   
        window.location.href = './login.html'  
    }
    else{
        renderErrors(result)
    }
}
}

if (document.getElementById('loginForm')) {
    
     let form = document.getElementById('loginForm')
        form.onsubmit =  async e => {
        e.preventDefault();
         
        const formData = new FormData(form)
        const data =   Object.fromEntries(formData)
    
        
       let response = await fetch("http://localhost:4000/api/login",
            {
                method:'POST',
                headers:{
                    'Content-Type':'application/json'
                },
                body:JSON.stringify(data)
            }
        )
        let result = await response.json()
     
    if(result.error){  
        document.getElementById('loginMsg').innerHTML=`*${result.error}`     
    }
    else{
        localStorage.setItem('user',JSON.stringify(result))
         
        window.location.href = './index.html'
        
    }
}
}

 