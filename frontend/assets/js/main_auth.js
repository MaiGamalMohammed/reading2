let books = JSON.parse(localStorage.getItem("books") || "[]");

function saveBooks() {
    localStorage.setItem("books", JSON.stringify(books));
}

function requireLogin() {
    const user = JSON.parse(localStorage.getItem('user'))
    if (!user) { window.location.href = 'login.html'; return null; }
    return user;
}

document.addEventListener('DOMContentLoaded', () => {
    const onIndex = !!document.getElementById('bookTable');
    const onAdd = !!document.getElementById('addForm');
    const onBook = !!document.getElementById('bookCard');

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
    if (onAdd) initAdd();
    if (onBook) initBook();
});

function initIndex() {
    populateCategoryFilter();
    renderBooks();
    document.getElementById('search').onkeyup = renderBooks;
    document.getElementById('filterStatus').onchange = renderBooks;
    document.getElementById('filterCategory').onchange = renderBooks;
}

function populateCategoryFilter() {
    const sel = document.getElementById('filterCategory');
    const cats = Array.from(new Set(books.map(b => b.category).filter(Boolean)));
    sel.innerHTML = '<option value="">كل الفئات</option>';
    cats.forEach(c => {
        let opt = document.createElement('option');
        opt.value = c;
        opt.textContent = c;
        sel.appendChild(opt);
    });
}

function renderBooks() {
    const user = localStorage.getItem('currentUser');
    const table = document.getElementById('bookTable');
    const search = document.getElementById('search').value.toLowerCase();
    const fs = document.getElementById('filterStatus').value;
    const fc = document.getElementById('filterCategory').value;

    table.innerHTML = '';
    books
        .filter(b => {
            const mine = b.owner === user;
            const match = (b.title || '').toLowerCase().includes(search) || (b.author || '').toLowerCase().includes(search);
            const statusOk = !fs || b.status === fs;
            const catOk = !fc || b.category === fc;
            return mine && match && statusOk && catOk;
        })
        .forEach((b, i) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
<td><img src="${b.image || 'https://via.placeholder.com/60x80'}" class="img-fluid rounded" style="width:60px;height:80px;object-fit:cover"></td>
<td><a href="book.html?id=${i}">${escapeHtml(b.title || '-')}</a></td>
<td>${escapeHtml(b.author || '-')}</td>
<td>${escapeHtml(b.year || '-')}</td>
<td>${escapeHtml(b.pages || '-')}</td>
<td>${escapeHtml(b.category || '-')}</td>
<td>${escapeHtml(b.status || '-')}</td>
<td>${escapeHtml(b.rating || '-')}</td>
<td>
  <a href="book.html?id=${i}" class="btn btn-sm btn-info mb-1">تفاصيل</a>
  <button class="btn btn-danger btn-sm" onclick="deleteBook(${i})">حذف</button>
</td>
`;
            table.appendChild(tr);
        });
    renderStats();
}

function initAdd() {
    const quoteInput = document.getElementById('quoteInput');
    const addQuoteBtn = document.getElementById('addQuoteBtn');
    const quotesList = document.getElementById('quotesList');
    let quotes = [];

    addQuoteBtn.addEventListener('click', () => {
        const v = quoteInput.value.trim();
        if (!v) return;
        quotes.push(v);
        const li = document.createElement('li');
        li.className = 'list-group-item d-flex justify-content-between align-items-start';
        li.innerHTML = `<div>${escapeHtml(v)}</div><button class="btn btn-sm btn-outline-danger">حذف</button>`;
        li.querySelector('button').onclick = () => { quotes = quotes.filter(q => q !== v); li.remove(); };
        quotesList.appendChild(li);
        quoteInput.value = '';
    });

    document.getElementById('addForm').onsubmit = e => {
        e.preventDefault();
        const user = localStorage.getItem('currentUser');
        const file = document.getElementById('image').files[0];
        const reader = new FileReader();
        reader.onload = () => {
            const book = {
                owner: user,
                title: title.value,
                author: author.value,
                year: year.value,
                pages: pages.value,
                category: category.value,
                status: status.value,
                rating: rating.value,
                notes: notes.value,
                image: file ? reader.result : '',
                quotes: quotes.slice()
            };
            books.push(book);
            saveBooks();
            window.location.href = 'index.html';
        };
        if (file) reader.readAsDataURL(file); else reader.onload();
    };
}

function initBook() {
    const params = new URLSearchParams(location.search);
    const id = Number(params.get('id'));
    if (isNaN(id) || !books[id]) { document.getElementById('bookCard').innerText = 'الكتاب غير موجود'; return; }
    const book = books[id];
    const user = localStorage.getItem('currentUser');

    const card = document.getElementById('bookCard');
    card.innerHTML = `
    <div class="row g-3">
      <div class="col-md-3 text-center">
        <img src="${book.image || 'https://via.placeholder.com/160x220'}" class="img-fluid rounded" style="max-height:320px;object-fit:cover">
        <div class="mt-2">${escapeHtml(book.title)}</div>
        <div class="text-muted">${escapeHtml(book.author)}</div>
      </div>
      <div class="col-md-9">
        <h4>${escapeHtml(book.title)}</h4>
        <p><strong>المؤلف:</strong> ${escapeHtml(book.author)} &nbsp; <strong>السنة:</strong> ${escapeHtml(book.year)}</p>
        <p><strong>الصفحات:</strong> ${escapeHtml(book.pages)} &nbsp; <strong>الفئة:</strong> ${escapeHtml(book.category || '-')}</p>
        <p><strong>الحالة:</strong> ${escapeHtml(book.status)} &nbsp; <strong>التقييم:</strong> ${escapeHtml(book.rating || '-')}</p>
        <p><strong>ملاحظات:</strong><br>${escapeHtml(book.notes || '-')}</p>

        <hr>
        <h5>الاقتباسات</h5>
        <ul id="quotesUL" class="list-group mb-3"></ul>

        <div id="quoteForm" class="input-group mb-3">
          <input id="newQuote" class="form-control" placeholder="اكتب اقتباس واضغط إضافة">
          <button id="saveQuoteBtn" class="btn btn-outline-secondary" type="button">إضافة اقتباس</button>
        </div>

        <div id="ownerControls"></div>
      </div>
    </div>
  `;

    const quotesUL = document.getElementById('quotesUL');
    (book.quotes || []).forEach((q, idx) => {
        const li = document.createElement('li');
        li.className = 'list-group-item d-flex justify-content-between align-items-start';
        li.innerHTML = `<div>${escapeHtml(q)}</div>` + (book.owner === user ? `<button class="btn btn-sm btn-outline-danger">حذف</button>` : '');
        if (book.owner === user) {
            li.querySelector('button').onclick = () => { book.quotes.splice(idx, 1); books[id] = book; saveBooks(); initBook(); };
        }
        quotesUL.appendChild(li);
    });

    document.getElementById('saveQuoteBtn').onclick = () => {
        const v = document.getElementById('newQuote').value.trim();
        if (!v) return;
        book.quotes = book.quotes || [];
        book.quotes.push(v);
        books[id] = book;
        saveBooks();
        initBook();
        document.getElementById('newQuote').value = '';
    };

    if (book.owner === user) {
        document.getElementById('ownerControls').innerHTML = `
      <div class="mt-3">
        <button id="editBookBtn" class="btn btn-primary me-2">تعديل</button>
        <button id="deleteBookBtn" class="btn btn-danger">حذف هذا الكتاب</button>
      </div>
    `;
        document.getElementById('deleteBookBtn').onclick = () => {
            if (!confirm('هل تريد حذف الكتاب؟')) return;
            books.splice(id, 1); saveBooks(); window.location.href = 'index.html';
        };
        document.getElementById('editBookBtn').onclick = () => {
            const newTitle = prompt('اسم الكتاب', book.title); if (newTitle) book.title = newTitle;
            const newAuthor = prompt('المؤلف', book.author); if (newAuthor) book.author = newAuthor;
            const newYear = prompt('السنة', book.year); if (newYear) book.year = newYear;
            const newPages = prompt('الصفحات', book.pages); if (newPages) book.pages = newPages;
            const newCategory = prompt('الفئة', book.category || ''); if (newCategory !== null) book.category = newCategory;
            const newStatus = prompt('الحالة', book.status); if (newStatus) book.status = newStatus;
            const newRating = prompt('التقييم من 1 إلى 10', book.rating); if (newRating) book.rating = newRating;
            const newNotes = prompt('ملاحظات', book.notes || ''); if (newNotes !== null) book.notes = newNotes;
            books[id] = book; saveBooks(); initBook();
        };
    } else {
        document.getElementById('quoteForm').style.display = 'none';
    }
}

function deleteBook(i) {
    if (!confirm('هل تريد حذف الكتاب؟')) return;
    books.splice(i, 1); saveBooks(); renderBooks();
}

function renderStats() {
    const user = localStorage.getItem('currentUser');
    const myBooks = books.filter(b => b.owner === user);
    const total = myBooks.length;
    const completed = myBooks.filter(b => b.status === 'مكتمل').length;
    const reading = myBooks.filter(b => b.status === 'قيد القراءة').length;
    const want = myBooks.filter(b => b.status === 'أريد قراءته').length;
    const pages = myBooks.reduce((s, b) => s + Number(b.pages || 0), 0);
    document.getElementById('stats').innerText = `إجمالي الكتب: ${total} | مكتمل: ${completed} | قيد القراءة: ${reading} | أريد قراءته: ${want} | إجمالي الصفحات: ${pages}`;
}

function escapeHtml(str) {
    if (!str) return '';
    return String(str).replace(/[&<>"']/g, s => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[s]);
}