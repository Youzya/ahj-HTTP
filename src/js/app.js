/* eslint-disable no-debugger */
/* eslint-disable no-param-reassign */
/* eslint-disable consistent-return */
/* eslint-disable no-loop-func */
/* eslint-disable prefer-template */
/* eslint-disable no-use-before-define */
/* eslint-disable no-plusplus */
/* eslint-disable array-callback-return */
/* eslint-disable no-alert */
/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
import Item from './Item';

const subscribeForm = document.querySelector('.subscribe-form');
const nameInput = document.querySelector('.name');
const namePhone = document.querySelector('.phone');
const unsubscribeBtn = document.querySelector('.unsubscribe');
const uploadBtn = document.querySelector('.upload');
const createBtn = document.querySelector('.create');
const list = document.querySelector('.list');
const modalAdd = document.querySelector('.modal_add');
const addBtn = document.querySelector('.add_button');
const modalDelete = document.querySelector('.modal_delete');
const modalEdit = document.querySelector('.modal_edit');
//console.log('modalEdit', modalEdit);

let curCheck = false;
let changeStat = false;
let retStat = false;

const closeBtn = modalEdit.querySelector('.cansel');
closeBtn.addEventListener('click', () => {
  //    console.log('close');
  modalEdit.style.display = 'none';
});

const closeBtnModalAdd = document.querySelector('.close');
//console.log(modalAdd);

const xhr_edit = new XMLHttpRequest();
let id_edit = 0;

function updateTicket(id, name, description, stat) {
  const sendObject =
    'name=' +
    encodeURIComponent(name) +
    '&description=' +
    encodeURIComponent(description) +
    '&status=' +
    encodeURIComponent(stat);

  xhr_edit.onreadystatechange = () => {
    if (xhr_edit.readyState !== 4) return null;
  };
  xhr_edit.open('PATCH', `https://ahj-http-back-rocr.onrender.com?method=editTicket&id=${id}`);
  xhr_edit.setRequestHeader(
    'Content-type',
    'application/x-www-form-urlencoded'
  );
  xhr_edit.send(sendObject);
}

const updateForm = document.querySelector('.update-form');
const updatehandler = updateForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const body = new FormData(updateForm);
  //    console.log('  ==============',body,'   ',body.get('name'),'   ',body.get('description'));
  const name = body.get('name');
  const description = body.get('description');

  updateTicket(id_edit, name, description, retStat);
  //    getTasks();
  modalEdit.style.display = 'none';
  body.delete('name');
  body.delete('description');
  updateForm.reset();
  //	updateForm.removeEventListener('submit', updatehandler);
  return null;
});

closeBtnModalAdd.addEventListener('click', () => {
  //  console.log('close');
  modalAdd.style.display = 'none';
});

addBtn.addEventListener('click', () => {
  //  console.log('open');
  modalAdd.style.display = 'flex';
});

function render(listList) {
  //  console.log('render');
  listList.map((item) => {
    //console.log(' ===item', item);
    const element = new Item(item);
    //    console.log('element', element);
    element.pushItem(list);
  });

  addItemFunctionality();
}

uploadBtn.addEventListener('click', getTasks);

subscribeForm.addEventListener('submit', (e) => {
  e.preventDefault();
  modalAdd.style.display = 'none';
  const body = new FormData(subscribeForm);
  const xhr = new XMLHttpRequest();
  const name = body.get('name');
  const description = body.get('description');
  const sendObject =
    'name=' +
    encodeURIComponent(name) +
    '&description=' +
    encodeURIComponent(description) +
    '&status=' +
    encodeURIComponent(false);
  //  console.log(sendObject);
  xhr.onreadystatechange = () => {
    if (xhr.readyState !== 4) return null;
  };

  xhr.open('POST', 'https://ahj-http-back-rocr.onrender.com?method=createTicket');
  xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
  //  console.log('==================',sendObject);
  xhr.send(sendObject);
  body.delete('name');
  body.delete('description');
  subscribeForm.reset();
  //  getTasks();
});

function addItemFunctionality() {
  const items = Array.from(document.querySelectorAll('.item'));
  //  console.log('ElementsFromLoop', items[0]);

  for (let i = 0; i < items.length; i++) {
    const element = items[i];
    const id = element.getAttribute('id');
    const btnEdit = element.querySelector('.edit');
    const btnCheckbox = element.querySelector('.checkbox');

    const btnDelete = element.querySelector('.delete');
    //    console.log('btnBtn', btnDelete);

    const description = element.querySelector('.description');

    btnCheckbox.addEventListener('click', (e) => {
      let btnCheck1 = e.currentTarget;
      if (btnCheck1.classList.contains('false')) {
        btnCheck1.classList.add('true');
        btnCheck1.classList.remove('false');
      } else {
        btnCheck1.classList.add('false');
        btnCheck1.classList.remove('true');
      }
      let curCheck = btnCheck1.classList.contains('true');
      let id = e.currentTarget.parentNode.parentNode.id;
      changeStatus(id, curCheck);
      description.classList.add('toggle');
    });

    btnDelete.addEventListener('click', () => {
      description.classList.add('toggle');
      deleteTask(id);
    });

    btnEdit.addEventListener('click', (e) => {
      e.preventDefault();
      description.classList.add('toggle');
      let check1 =
        e.currentTarget.parentNode.parentNode.querySelector('.checkbox');
      check1 = check1.classList.contains('true');
      editTask(id);
    });

    element.addEventListener('click', () => {
      if (!description.classList.contains('toggle')) {
        //        console.log('!TOGGLE');
        description.style.display = 'flex';
        addDascription(description, id);
      } else {
        //        console.log('TOGGLE');
        description.style.display = 'none';
        description.textContent = '';
        description.classList.remove('toggle');
      }
    });
  }
}

function addDascription(element, id) {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', `https://ahj-http-back-rocr.onrender.com?method=ticketById&id=${id}`);
  xhr.send();
  xhr.addEventListener('load', () => {
    if (xhr.status >= 200 && xhr.status < 300) {
      //      console.log('ответ', xhr.responseText);
      try {
        const data = JSON.parse(xhr.responseText);
        // console.log('description', data.ticket.description);
        element.textContent = data.ticket.description;
        // element.value = data.ticket.description;
        // modalEdit.description.value = data.ticket.description;
        element.classList.add('toggle');
      } catch (err) {
        // console.error(err);
      }
    }
  });
}

function changeStatus(id, stat) {
  //  console.log('  ====stat',stat);
  changeStat = stat;
  const xhr = new XMLHttpRequest();
  xhr.open('GET', `https://ahj-http-back-rocr.onrender.com?method=ticketById&id=${id}`);
  xhr.send();
  xhr.addEventListener('load', () => {
    if (xhr.status >= 200 && xhr.status < 300) {
      //      console.log('ответ', xhr.responseText);
      try {
        const data = JSON.parse(xhr.responseText);
        updateTicket(id, data.ticket.name, data.ticket.description, changeStat);
      } catch (err) {
        // console.error(err);
      }
    }
  });
}

function deleteTask(id) {
  modalDelete.style.display = 'flex';
  const yesBtn = modalDelete.querySelector('yes');
  const noBtn = modalDelete.querySelector('no');
  //  console.log(yesBtn, noBtn);
  modalDelete.addEventListener('click', (e) => {
    if (e.target.className.includes('no')) {
      //      console.log('e.target', e.target);
      modalDelete.style.display = 'none';
    } else {
      const xhr = new XMLHttpRequest();
      xhr.onreadystatechange = () => {
        if (xhr.readyState !== 4);
        return null;
        // alert(xhr.responseText);
      };
      xhr.open(
        'DELETE',
        `https://ahj-http-back-rocr.onrender.com?method=deleteTicketById&id=${id}`
      );
      xhr.send();
      modalDelete.style.display = 'none';
      //      getTasks();
    }
  });
}

function getTasks() {
  while (list.firstChild) {
    list.removeChild(list.firstChild);
  }

  const xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://ahj-http-back-rocr.onrender.com?method=allTickets');
  xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
  xhr.send();
  xhr.addEventListener('load', () => {
    if (xhr.status >= 200 && xhr.status < 300) {
      //      console.log('ответ', xhr.responseText);
      try {
        const data = JSON.parse(xhr.responseText);
        //        console.log('Data', data);
        render(data);
      } catch (err) {
        //        console.error(err);
      }
    }
  });
}

function editTask(id) {
  modalEdit.style.display = 'flex';
  const inputName = modalEdit.querySelector('.name');
  const inputDescription = modalEdit.querySelector('.text');
  const editBtn = modalEdit.querySelector('.save');
  id_edit = id;

  xhr_edit.open('GET', `https://ahj-http-back-rocr.onrender.com?method=ticketById&id=${id_edit}`);
  xhr_edit.send();
  xhr_edit.addEventListener('load', () => {
    if (xhr_edit.status >= 200 && xhr_edit.status < 300) {
      //      console.log('ответ', xhr_edit.responseText);
      try {
        const data = JSON.parse(xhr_edit.responseText);
        //        console.log('description', data.ticket.description);
        inputName.value = data.ticket.name;
        inputDescription.value = data.ticket.description;
        retStat = data.ticket.status;
        //console.log(' === status ',data.ticket.status);
      } catch (err) {
        console.error(err);
      }
    }
  });
}
