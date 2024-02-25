'use strict';


const postWraper = document.getElementById('postWraper');
const postOverlay = document.getElementById('overLay');
const contentBlock = document.getElementById('content');
const closeOverlay = document.getElementById('close');
const addBtn = document.getElementById('add');
const addOverlay = document.getElementById('addOverlay');
const form = document.getElementById('form-addOverlay');



function ajax(url, callback) {
    fetch(url, {
        method: 'GET',
    })

    .then(function(response) {
        if(response.status !== 200) {
            throw response.status;
        }
        return response.json();
    })
    .then(function (responseData) {
        callback(responseData);
    })
    .catch (function (error) {
        if (error === 404) {
            console.log('Page Not Found');
        } else if(error === 500) {
            console.log('Server Error');
        }
    })
}

ajax('https://jsonplaceholder.typicode.com/posts',function(data) {
    
    data.forEach(element => {
        createPosts(element);
    });
});





function createPosts(item) {
    const divContainer = document.createElement ('div');
    divContainer.classList.add('posts');
    divContainer.setAttribute('data-id', item.id);


    const h3Post = document.createElement('h3');
    h3Post.innerText = item.id;

    const h2Post = document.createElement('h2');
    h2Post.innerText = item.title;
    


    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete Post';
    deleteBtn.classList.add('delete-btn');
    deleteBtn.setAttribute('data-id', item.id);


    divContainer.appendChild(h3Post);
    divContainer.appendChild(h2Post);
    divContainer.appendChild(deleteBtn);


    // washlis gilakis logika

    deleteBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        const deleteId = e.target.getAttribute('data-id');
        console.log(deleteId);
        const deleteUrl = `https://jsonplaceholder.typicode.com/posts/${deleteId}`;
        console.log(deleteUrl);
        fetch(deleteUrl, {
            method: 'DELETE',
        })
        .then(function(deletedData) {
            console.log(deletedData);
            divContainer.remove();
        });
    });


    divContainer.addEventListener('click', function() {
        console.log(this);
        const postId = this.getAttribute('data-id');
        console.log(postId);
        postOverlay.classList.add('activeOverlay');
        const newUrl = `https://jsonplaceholder.typicode.com/posts/${postId}`;
        console.log(newUrl);
        ajax(newUrl, function(elementNew) {            
            overlayInfo(elementNew);
        });
    });

    postWraper.appendChild(divContainer);
}

// detaluri informaciis amogeba
function overlayInfo(item) {
    const pDescr = document.createElement('p');
    pDescr.innerText = item.body;


    contentBlock.appendChild(pDescr);
}

// close
closeOverlay.addEventListener('click', function() {
    postOverlay.classList.remove('activeOverlay');
    contentBlock.innerHTML = ' ';
});


// postis damateba

addBtn.addEventListener('click', function () {
    addOverlay.classList.add('addActive');
    document.getElementById('postTitle').value = "";
});

form.addEventListener('submit', function (e) {
    e.preventDefault();
    console.log(e.target[0].value);
    let formDataSend = {
        title: e.target[0].value,
        userId: 11,
    };

    console.log(formDataSend);

    fetch('https://jsonplaceholder.typicode.com/posts', {
        method: 'POST',
        body: JSON.stringify(formDataSend),
        headers: {
            "Content-type": "application/json; charset=UTF-8",
        },
    })
    .then((response) => response.json())
    .then((SendedObj) => {
        createPosts(SendedObj);
        addOverlay.classList.remove('addActive');
        
    });
});