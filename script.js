const inputElement = document.getElementById('new-item-input');
const btnAdd = document.getElementById('btn-add-item');
const itemListElement = document.getElementById('item-list');
const statsLeftElement = document.getElementById('stats-left');
const statsBoughtElement = document.getElementById('stats-bought');



let editingId = null;

function render() {
    localStorage.setItem('buyListState', JSON.stringify(items));

    itemListElement.innerHTML = '';
    statsLeftElement.innerHTML = '';
    statsBoughtElement.innerHTML = '';

    items.forEach(item => {
        const li = document.createElement('li');
        li.className = `item ${item.isBought ? 'bought' : ''}`;
        
        let innerHTML = '';

        if (editingId === item.id && !item.isBought) {
            innerHTML += `<input type="text" class="edit-input" value="${item.name}" data-id="${item.id}">`;
        } else {
            innerHTML += `<span class="item-name" data-id="${item.id}">${item.name}</span>`;
        }

        innerHTML += `<div class="controls">`;
        if (!item.isBought) {
            innerHTML += `<button class="btn-circle btn-minus" data-id="${item.id}" ${item.quantity <= 1 ? 'disabled' : ''} data-tooltip="Зменшити">-</button>`;
        }
        innerHTML += `<span class="quantity-badge">${item.quantity}</span>`;
        if (!item.isBought) {
            innerHTML += `<button class="btn-circle btn-plus" data-id="${item.id}" data-tooltip="Збільшити">+</button>`;
        }
        innerHTML += `</div>`;

        innerHTML += `<div class="actions">`;
        innerHTML += `<button class="btn-status" data-id="${item.id}" data-tooltip="${item.isBought ? 'Зробити не купленим' : 'Відмітити як куплене'}">${item.isBought ? 'Не куплено' : 'Куплено'}</button>`;
        
        if (!item.isBought) {
            innerHTML += `<button class="btn-delete" data-id="${item.id}" data-tooltip="Видалити товар">×</button>`;
        }
        innerHTML += `</div>`;

        li.innerHTML = innerHTML;
        itemListElement.appendChild(li);

        const statItem = `
            <span class="product-item ${item.isBought ? 'crossed' : ''}">
                ${item.name} <span class="amount">${item.quantity}</span>
            </span>
        `;
        if (item.isBought) {
            statsBoughtElement.innerHTML += statItem;
        } else {
            statsLeftElement.innerHTML += statItem;
        }
    });

    if (editingId !== null) {
        const editInput = document.querySelector(`.edit-input[data-id="${editingId}"]`);
        if (editInput) {
            editInput.focus();
            editInput.selectionStart = editInput.selectionEnd = editInput.value.length;
        }
    }
}

// ЛОГІКА 

function addItem() {
    const name = inputElement.value.trim();
    if (name) {
        items.push({
            id: Date.now(), 
            name: name,
            quantity: 1,   
            isBought: false
        });
        inputElement.value = ''; 
        inputElement.focus();   
        render();
    }
}

btnAdd.addEventListener('click', addItem);
inputElement.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') addItem();
});

itemListElement.addEventListener('click', (e) => {
    const id = parseInt(e.target.dataset.id);
    if (!id) return;

    if (e.target.classList.contains('btn-delete')) {
        items = items.filter(item => item.id !== id);
        render();
    }
    
    if (e.target.classList.contains('btn-status')) {
        const item = items.find(i => i.id === id);
        item.isBought = !item.isBought;
        render();
    }

    if (e.target.classList.contains('btn-plus')) {
        const item = items.find(i => i.id === id);
        item.quantity++;
        render();
    }
    if (e.target.classList.contains('btn-minus')) {
        const item = items.find(i => i.id === id);
        if (item.quantity > 1) {
            item.quantity--;
            render();
        }
    }

    if (e.target.classList.contains('item-name')) {
        const item = items.find(i => i.id === id);
        if (!item.isBought) {
            editingId = id;
            render();
        }
    }
});

itemListElement.addEventListener('focusout', (e) => {
    if (e.target.classList.contains('edit-input')) {
        const id = parseInt(e.target.dataset.id);
        const newName = e.target.value.trim();
        const item = items.find(i => i.id === id);
        
        if (newName !== '') {
            item.name = newName;
        }
        editingId = null; 
        render();
    }
});

itemListElement.addEventListener('keyup', (e) => {
    if (e.key === 'Enter' && e.target.classList.contains('edit-input')) {
        e.target.blur(); 
    }
});

render();