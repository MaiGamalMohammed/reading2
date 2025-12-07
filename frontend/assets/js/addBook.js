 
// Fetch categories from your API and populate the dropdown
async function loadCategories() {
    
  try {
    const categories = JSON.parse(localStorage.getItem("categories")) || [];

 
    const select = document.getElementById("category");
    select.innerHTML = ""; // clear existing options

    categories.forEach(cat => {
      const option = document.createElement("option");
      option.value = cat.id;        // category_id from DB
      option.textContent = cat.name; // category name
      select.appendChild(option);
    });
  } catch (error) {
    console.error("Error loading categories:", error);
  }
}

// Call this when the page loads
document.addEventListener("DOMContentLoaded", loadCategories);




let form = document.getElementById("addForm")

form.onsubmit = async e=>{
    e.preventDefault();
    const formData = new FormData(form)
    let data =   Object.fromEntries(formData)
    data.user_id = JSON.parse(localStorage.getItem('user')).id
  data.pages_read = parseInt(data.pages_read)
data.pages_total = parseInt(data.pages_total)
data.publication_year = parseInt(data.publication_year)     
    let response = await fetch("https://localhost:4000/api/book",{
      method:"post",
      headers:{
                    'Content-Type':'application/json'
                },
      body:JSON.stringify(data),
      credentials:"include"
    })
    
    let res = await response.json()
   if(res.message=="added")window.location.href = "./index.html"
    else document.getElementById("error").innerHTML = `*${res.message}`

}