let categories = JSON.parse(localStorage.getItem("categories") || "[]");

async function makeGetReq(url) {
    let response = await fetch(url,{
        method:"get",
        credentials:'include'
    })
    let result = await response.json()
    return result
}

async function getBooks() {
   
    var books = await makeGetReq("https://localhost:4000/api/books")
    return books
}

var books;

async function makePostReq(url,data){
    let response = await fetch(`${url}`,{
        method:"post",
        credentials:"include",
        headers:{
            "content-type":"application/json"
        },
        body:JSON.stringify(data)
    })

    let result = await response.json()
    return result
}

async function makePutReq(url,data){
    let response = await fetch(`${url}`,{
        method:"put",
        credentials:"include",
        headers:{
            "content-type":"application/json"
        },
        body:JSON.stringify(data)
    })

    let result = await response.json()
    return result
}

function requireLogin() {
    const user = JSON.parse(localStorage.getItem('user'))
    if (!user) { window.location.href = 'login.html'; return null; }
    return user;
}

document.addEventListener('DOMContentLoaded', async() => {
    const onIndex = !!document.getElementById('bookTable');
    const onBook = !!document.getElementById('bookCard');
    const onBookEdit = document.getElementById('editForm')
    const onQuoteAdd = document.getElementById('addFormQuote')
    const onQuoteUpdate = document.getElementById('updateFormQuote')
    const onRatingAdd = document.getElementById("addFormRating")

    books = await getBooks()
     
    const user = requireLogin();
    if (!user) return;

    const welcome = document.getElementById('welcomeUser');
    if (welcome) welcome.innerText = user.name;

    const logoutBtns = document.querySelectorAll('#logoutBtn, #logoutBtn2, #logoutBtn3');
    logoutBtns.forEach(b => {
        b && b.addEventListener('click', () => {
            localStorage.removeItem('currentUser');
            window.location.href = 'login.html';
        });
    });

    if (onIndex) initIndex();
    if (onBook) await initBook();
    if(onBookEdit) editBook();
    if(onQuoteAdd) await addQuote();
    if(onQuoteUpdate) await updateQuote();
    if(onRatingAdd) await addRating()
});

function initIndex() {
    loadCategories('filterCategory');
    renderBooks();
    document.getElementById('search').onkeyup = renderBooks;
    document.getElementById('filterStatus').onchange = renderBooks;
    document.getElementById('filterCategory').onchange = renderBooks;
}

function loadCategories(id) {
    const sel = document.getElementById(`${id}`);
    
    categories.forEach(c => {
        let opt = document.createElement('option');
        opt.value = c.id;
        opt.textContent = c.name;
        sel.appendChild(opt);
    });
}

function renderBooks() {
     
    const table = document.getElementById('bookTable');
    const search = document.getElementById('search').value.toLowerCase();
    const fs = document.getElementById('filterStatus').value;
    const fc = document.getElementById('filterCategory').value;

    table.innerHTML = '';
    books.filter(b=> (!fc||b.category_id==fc)&&(!fs||b.status)&&(!search||b.name==search || b.author == search))
        .forEach((b, i) => {
             
            const tr = document.createElement('tr');
            tr.innerHTML = `
<td><img src="${b.img || 'https://img.freepik.com/free-vector/red-text-book-closed-icon_18591-82397.jpg?semt=ais_hybrid&w=740&q=80'}" class="img-fluid rounded" style="width:85%;height:80px;object-fit:cover"></td>
<td><a href="book.html?id=${b.id}">${escapeHtml(b.name || '-')}</a></td>
<td>${escapeHtml(b.author || '-')}</td>
<td>${escapeHtml(b.publication_year || '-')}</td>
<td>${escapeHtml(b.pages_total|| '-')}</td>
<td>${escapeHtml(b.pages_read|| '-')}</td>
<td>${escapeHtml(categories.find(cat=>cat.id==b.category_id).name || '-')}</td>
<td>${escapeHtml(b.status || '-')}</td>
 
<td>
  <a href="book.html?id=${b.id}" class="btn btn-sm btn-info  ">تفاصيل</a>
  <button class="btn btn-danger btn-sm" onclick="deleteBook(${b.id})">حذف</button>
</td>

<td>
  <a href="quote.html?id=${b.id}" class="btn btn-sm btn-secondary  ">اقتباس</a>
  <a href="rating.html?id=${b.id}" class="btn btn-warning btn-sm" ">تقييم</a>
</td>
`;
            table.appendChild(tr);
        });
    renderStats();
}

var quotes 
var rating

async function getRating(id) {
    let result = await makeGetReq(`https://localhost:4000/api/rating?book_id=${id}`)
    rating = result
}

function renderRating(data){
 
    let ratingCon = document.getElementById("rating")

    ratingCon.innerHTML = `
    <div class="card-body">
      <h5 class="card-title text-muted">التقييم</h5>
      <p id="review" class="card-text">${data[0].review}</p>
      <div class="m-2 d-flex justify-content-around">
      <div id="starRating"></div>
    <button class="btn" onclick="deleteRating(${data[0].id})">
    <i class="bi bi-trash text-danger w-100"></i>  
    </button>
    </div>
    </div>
    `
    const starContainer = document.getElementById("starRating");
     
    for (let i = 1; i <= 5; i++) {
      const star = document.createElement("span");
      star.classList.add("star");
      if (i <= data[0].score) {
        star.classList.add("filled");
      }
      star.innerHTML = "★"; // Unicode star
      starContainer.appendChild(star);
}

}

async function addRating(){
    const params = new URLSearchParams(location.search);
    const book_id = Number(params.get('id'));
    let form = document.getElementById('addFormRating')
    form.onsubmit = async(e)=>{
        e.preventDefault()
        const formData = new FormData(form)
        let data =   Object.fromEntries(formData)
        data.book_id = book_id

        let result = await makePostReq("https://localhost:4000/api/rating",data)
        if(result.message=="created") window.location.href = "./index.html"
    }
}

async function deleteRating(id){
    let response = await fetch("https://localhost:4000/api/rating",{
        credentials:"include",
        method:"delete",
        body:JSON.stringify({id:id}),
        headers:{
            "content-type":"application/json"
        }
    })

    let result = await response.json()
    if(result.message=="deleted") location.reload()
    
}

async function  getQuotes(id){
    let result = await makeGetReq(`https://localhost:4000/api/quotes?book_id=${id}`)
    quotes = result
} 

function renderQuotes(data){
    let quoteUl = document.getElementById("quotesUL")
    let text = ''
    data.forEach(quote=>{
       text+=`
        <li class="list-group-item">
      <div class="quote-text fst-italic mb-2" id="text">
        "${quote.text}"
      </div>
      <div class="quote-comment text-muted mb-2" id="comment">
        تعليقك: ${quote.comment}
      </div>
      <div class="d-flex justify-content-between align-items-center">       
       <div class="text-secondary small id="page_number"">رقم الصفحة: ${quote.page_number}</div>
        <div>
          <a class="btn btn-sm btn-success me-2" id="editQuoteBtn"   href="updateQuote.html?id=${quote.id}&book_id=${quote.book_id}" > تعديل</a>
          <button class="btn btn-sm btn-danger" id="deleteQuoteBtn" onclick="deleteQuote(${quote.id})">حذف</button>
        </div>

      </div>
    </li>
        `
    quoteUl.innerHTML=text
    })
}

async function deleteQuote(id) {
    let response = await fetch("https://localhost:4000/api/quote",{
        credentials:"include",
        method:"delete",
        body:JSON.stringify({id:id}),
        headers:{
            "content-type":"application/json"
        }
    })

    let result = await response.json()
    
    if(result.message=="deleted")location.reload()
     
}

async function addQuote(){
    const params = new URLSearchParams(location.search);
    const book_id = Number(params.get('id'));
    let form = document.getElementById('addFormQuote')
    form.onsubmit = async(e)=>{
        e.preventDefault()
        const formData = new FormData(form)
        let data =   Object.fromEntries(formData)
        data.book_id = book_id

        let result = await makePostReq("https://localhost:4000/api/quote",data)
        if(result.message=="created") window.location.href = "./index.html"
    }
}

 

async function initBook() {
    const params = new URLSearchParams(location.search);
    const id = Number(params.get('id'));
    if (isNaN(id) ) { document.getElementById('bookCard').innerText = 'الكتاب غير موجود'; return; }
    const book = books.find(b=>b.id==id);
 
    if (book==undefined) { document.getElementById('bookCard').innerText = 'الكتاب غير موجود'; return; }
    

    const card = document.getElementById('bookCard');
    card.innerHTML = `
    <div class="row g-3">
      <div class="col-md-4 text-center">
        <img src="${book.img || 'https://images.pexels.com/photos/674010/pexels-photo-674010.jpeg'}" class="img-fluid rounded" style="max-height:320px;object-fit:cover">
        <div class="mt-2">${escapeHtml(book.name)}</div>
        <div class="text-muted">${escapeHtml(book.author)}</div>
          <div id="rating" class="card mt-2" style="max-width:85%">
     
        </div>
      </div>
      <div class="col-md-7">
        <h4>${escapeHtml(book.name)}</h4>
        <p><strong>المؤلف:</strong> ${escapeHtml(book.author)} &nbsp; <strong>السنة:</strong> ${escapeHtml(book.publication_year)}</p>
        <p><strong>الصفحات:</strong> ${escapeHtml(book.pages_total)} &nbsp; <strong>الفئة:</strong> ${escapeHtml(categories.find(c=>c.id==book.category_id).name || '-')}</p>
        <p><strong>الحالة:</strong> ${escapeHtml(book.status)}</p>
        <p><strong>ملاحظات:</strong><br>${escapeHtml(book.notes || '-')}</p>
     <p><strong>وصف الكتاب:</strong><br>${escapeHtml(book.description || '-')}</p>
        <hr>
        <h5>الاقتباسات</h5>
        <ul id="quotesUL" class="list-group mb-3">
         
        </ul>

        <div id="ownerControls">
         <div class="mt-3">
        <a href="edit.html?id=${book.id}" id="editBookBtn" class="btn btn-primary me-2">تعديل</a>
        <button id="deleteBookBtn" onclick=deleteBook(${book.id}) class="btn btn-danger">حذف هذا الكتاب</button>
      </div>
        </div>
      </div>
    </div>
  `;

await getQuotes(book.id)
renderQuotes(quotes)

await getRating(book.id)
renderRating(rating)
 

}

async function updateQuote(){
    const params = new URLSearchParams(location.search);
 
    const quote_id = Number(params.get('id'));
    const book_id = Number(params.get('book_id'))
    
    await getQuotes(book_id)
     
    const quote = quotes.find(q=>q.id==quote_id)

    let form = document.getElementById('updateFormQuote')
    
    document.getElementById('text').value = `${quote.text}`
    document.getElementById('page_number').value = `${quote.page_number}`
    document.getElementById('comment').value = `${quote.comment}`
   

    form.onsubmit = async(e)=>{
        e.preventDefault()
        const formData = new FormData(form)
        let data =   Object.fromEntries(formData)
         
        data.id = quote_id

        let response = await makePutReq("https://localhost:4000/api/quote",data)
        
        if(response.message=="updated") window.location.href = "./index.html"
    }
}


function deleteBook(book_id) {
    if (!confirm('هل تريد حذف الكتاب؟')) return;
    fetch("https://localhost:4000/api/book",{
        method:"delete",
        credentials:"include",
        body:JSON.stringify({id:book_id}),
        headers:{
            'Content-Type':'application/json'
        }

    }).then(async response => {
    const data = await response.json();
    if(data.message=="deleted") location.reload()
    else alert(data.message)
    
  })
  .catch(error => console.error(error));
}

function renderStats() {
 
    const total = books.length;
    const completed = books.filter(b => b.status === 'مكتمل').length;
    const reading = books.filter(b => b.status === 'قيد القراءة').length;
    const want = books.filter(b => b.status === 'أريد قراءته').length;
    const pages = books.reduce((s, b) => s + Number(b.pages || 0), 0);
    document.getElementById('stats').innerText = `إجمالي الكتب: ${total} | مكتمل: ${completed} | قيد القراءة: ${reading} | أريد قراءته: ${want} | إجمالي الصفحات: ${pages}`;
}

function escapeHtml(str) {
    if (!str) return '';
    return String(str).replace(/[&<>"']/g, s => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[s]);
}

function renderEdit(book){
    loadCategories('category_id')
    
    for(const key in book){
        if(key=='id'||key=='user_id') continue
         
        document.getElementById(`${key}`).value = book[key]
         
    }  
}

function editBook(){
    const params = new URLSearchParams(location.search);
    const id = Number(params.get('id'));
    const book = books.find(b=>b.id==id)
    renderEdit(book)

    let form = document.getElementById("editForm")

    form.onsubmit = async e=>{
    e.preventDefault();
    const formData = new FormData(form)
    let data =   Object.fromEntries(formData)
    data.user_id = JSON.parse(localStorage.getItem('user')).id
    data.id = id
    data.pages_read = parseInt(data.pages_read)
data.pages_total = parseInt(data.pages_total)
data.publication_year = parseInt(data.publication_year)   
     
    let response = await makePutReq("https://localhost:4000/api/book",data)
    if(response.message=="updated") window.location.href = "./index.html"
   
}
}