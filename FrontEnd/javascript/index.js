let rawProjects = [];
let storedToken;
let categories = [];

// filtrage des projets par catégories.
const getCategories = async function () {
    const response = await fetch('http://localhost:5678/api/categories');
    categories = await response.json();
    console.log(categories);

    const filters = document.querySelector('.filters');
    filters.innerHTML = '';
    filters.addEventListener('click', (e) => {
        if (e.target.id === '') {
            return;
        }

        const id = parseInt(e.target.id);
        if (id === 0) {
            displayProjects(rawProjects);
            return;
        }

        displayProjects(
            rawProjects.filter(project => project.category.id === id)
        );
    });

    const all = { id: 0, name: 'Tous' };
    categories.unshift(all);

    categories.forEach(category => {
        const button = document.createElement('button');
        button.innerHTML = category.name;
        button.id = category.id;

        filters.appendChild(button);
    });
}

// Récupération et affichage des projets via l'API.
const getProjects = async function () {
    const response = await fetch('http://localhost:5678/api/works');
    rawProjects = await response.json();
    console.log(rawProjects);

    displayProjects(rawProjects);
    displayWorks(rawProjects);
}

function displayProjects(projects) {
    const gallery = document.querySelector('.gallery');

    gallery.innerHTML = '';

    projects.forEach((project) => {
        const figure = document.createElement('figure');
        const img = document.createElement('img');
        img.src = project.imageUrl;
        img.alt = project.title;

        const figcaption = document.createElement('figcaption');
        figcaption.innerHTML = project.title;

        figure.appendChild(img);
        figure.appendChild(figcaption);
        gallery.appendChild(figure);
    });
}

// Supprimer un projet.
const deleteProject = async function (id) {
    await fetch(`http://localhost:5678/api/works/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${storedToken}`
        }
    });
}

// Affichage des projets sur la modale.
function displayWorks(projects) {
    const modalContent = document.querySelector('.modal-content');
    modalContent.innerHTML = '';

    projects.forEach((project) => {
        const img = document.createElement('img');
        img.classList.add('trash-parent');
        img.src = project.imageUrl;
        img.alt = project.title;
        img.classList.add('modal-image');

        const figcaption = document.createElement('figcaption');
        figcaption.innerHTML = project.title;
        figcaption.innerHTML = "éditer";

        const iconMove = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        iconMove.classList.add('svg-move');
        iconMove.innerHTML = `
            <g id="Move">
                <rect id="Rectangle 20" width="17" height="17" rx="2" fill="black"/>
                <path id="arrows-up-down-left-right" d="M9.05089 3.20363C8.77938 2.93212 8.33845 2.93212 8.06694 3.20363L6.6768 4.59377C6.40529 4.86528 6.40529 5.30621 6.6768 5.57772C6.94831 5.84924 7.38925 5.84924 7.66076 5.57772L7.86493 5.37355V7.86493H5.37355L5.57772 7.66076C5.84924 7.38925 5.84924 6.94831 5.57772 6.6768C5.30621 6.40529 4.86528 6.40529 4.59377 6.6768L3.20363 8.06694C2.93212 8.33845 2.93212 8.77938 3.20363 9.05089L4.59377 10.441C4.86528 10.7125 5.30621 10.7125 5.57772 10.441C5.84924 10.1695 5.84924 9.72858 5.57772 9.45707L5.37355 9.2529H7.86493V11.7465L7.66076 11.5423C7.38925 11.2708 6.94831 11.2708 6.6768 11.5423C6.40529 11.8138 6.40529 12.2547 6.6768 12.5262L8.06694 13.9164C8.33845 14.1879 8.77938 14.1879 9.05089 13.9164L10.441 12.5262C10.7125 12.2547 10.7125 11.8138 10.441 11.5423C10.1695 11.2708 9.72858 11.2708 9.45707 11.5423L9.2529 11.7465V9.25507H11.7465L11.5423 9.45924C11.2708 9.73076 11.2708 10.1717 11.5423 10.4432C11.8138 10.7147 12.2547 10.7147 12.5262 10.4432L13.9164 9.05306C14.1879 8.78155 14.1879 8.34062 13.9164 8.06911L12.5262 6.67897C12.2547 6.40746 11.8138 6.40746 11.5423 6.67897C11.2708 6.95048 11.2708 7.39142 11.5423 7.66293L11.7465 7.8671H9.25507V5.37355L9.45924 5.57772C9.73076 5.84924 10.1717 5.84924 10.4432 5.57772C10.7147 5.30621 10.7147 4.86528 10.4432 4.59377L9.05306 3.20363H9.05089Z" fill="white"/>
            </g>
        `;

        const moveBtn = document.createElement('button');
        moveBtn.classList.add('btn-move');

        const iconBin = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        iconBin.classList.add('svg-icon');
        iconBin.innerHTML = `
          <g id="trash-can-solid">
            <path id="Vector" d="M2.71607 0.35558C2.82455 0.136607 3.04754 0 3.29063 0H5.70938C5.95246 0 6.17545 0.136607 6.28393 0.35558L6.42857 0.642857H8.35714C8.71272 0.642857 9 0.930134 9 1.28571C9 1.64129 8.71272 1.92857 8.35714 1.92857H0.642857C0.287277 1.92857 0 1.64129 0 1.28571C0 0.930134 0.287277 0.642857 0.642857 0.642857H2.57143L2.71607 0.35558ZM0.642857 2.57143H8.35714V9C8.35714 9.70915 7.78058 10.2857 7.07143 10.2857H1.92857C1.21942 10.2857 0.642857 9.70915 0.642857 9V2.57143ZM2.57143 3.85714C2.39464 3.85714 2.25 4.00179 2.25 4.17857V8.67857C2.25 8.85536 2.39464 9 2.57143 9C2.74821 9 2.89286 8.85536 2.89286 8.67857V4.17857C2.89286 4.00179 2.74821 3.85714 2.57143 3.85714ZM4.5 3.85714C4.32321 3.85714 4.17857 4.00179 4.17857 4.17857V8.67857C4.17857 8.85536 4.32321 9 4.5 9C4.67679 9 4.82143 8.85536 4.82143 8.67857V4.17857C4.82143 4.00179 4.67679 3.85714 4.5 3.85714ZM6.42857 3.85714C6.25179 3.85714 6.10714 4.00179 6.10714 4.17857V8.67857C6.10714 8.85536 6.25179 9 6.42857 9C6.60536 9 6.75 8.85536 6.75 8.67857V4.17857C6.75 4.00179 6.60536 3.85714 6.42857 3.85714Z" fill="white"/>
          </g>
        `;

        const trashBtn = document.createElement('button');
        trashBtn.classList.add('btn-trash');
        const id = project.id;
        trashBtn.id = project.id;
        trashBtn.addEventListener('click', async (e) => {
            if (typeof trashBtn.id === 'string') {
                await deleteProject(id);
                await getProjects();
                return;
            }
        });

        const figure = document.createElement('figure');
        figure.classList.add('figure-list');

        figure.appendChild(img);
        figure.appendChild(figcaption);
        figure.appendChild(moveBtn);
        moveBtn.appendChild(iconMove);
        figure.appendChild(trashBtn);
        trashBtn.appendChild(iconBin);
        modalContent.appendChild(figure);
    });
}

// Affichage de la modale ajout de projet.
function showModal2() {
    const addBtn = document.querySelector('.btn-add');
    const arrowBtn = document.querySelector('.btn-arrow');

    arrowBtn.addEventListener('click', () => {
        getProjects();
        document.querySelector('.modal-actions').style.display = 'flex';
        document.querySelector('.hr1').style.display = 'flex';
        arrowBtn.style.visibility = 'hidden';
    });

    addBtn.addEventListener('click', () => {
        document.querySelector('.modal-content').innerHTML = '';
        document.querySelector('.modal-actions').style.display = 'none';
        document.querySelector('.hr1').style.display = 'none';
        document.querySelector('.title-gallery').innerHTML = 'Ajout photo';
        arrowBtn.style.visibility = 'visible';

        const templateAddWorkForm = document.querySelector("#template-add-work-form").content.cloneNode(true);

        const imageFileInput = templateAddWorkForm.getElementById('file');
        const imgDw = templateAddWorkForm.querySelector('.img-preview');
      
        imageFileInput.addEventListener('change', function() {
            console.log(this.files);
            const file = this.files[0];
            if (file) {

                const reader = new FileReader();
                imgDw.style.visibility = 'visible';
                document.querySelector('.add-photo').style.visibility = 'hidden';
                document.querySelector('.img-span').style.visibility = 'hidden';
                reader.readAsDataURL(file);

                reader.addEventListener('load', function(){
                    imgDw.setAttribute('src', this.result);
                });
            };
        });
    
        const categoryInput = templateAddWorkForm.getElementById('category-input');

        for (let category of categories) {
            const option = document.createElement('option');
            option.value = category.id;
            option.innerText = category.name;

            categoryInput.appendChild(option);
        }

        let addWorkForm = templateAddWorkForm.getElementById('add-work-form');
        addWorkForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            confirm('Souhaitez-vous confirmer?');
              
                const formData = new FormData(addWorkForm);
                console.log(formData);

                await fetch('http://localhost:5678/api/works', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${storedToken}`,
                        'Content-Type': 'multipart/form-data'
                    },
                    body: formData
                });

                await getProjects();
                document.querySelector('.modal-actions').style.display = 'flex';
                document.querySelector('.hr1').style.display = 'flex';
                arrowBtn.style.visibility = 'hidden';

            });
            
            document.querySelector('.modal-content').appendChild(templateAddWorkForm);
    });
}

// Gestion de la modale.
function manageProject() {
    const openBtn = document.querySelector('.btn-modify');
    const closeBtn = document.querySelector('.btn-close');
    const modal = document.querySelector('#modal-edit');

    openBtn.addEventListener('click', () => {
        modal.showModal();
    });

    closeBtn.addEventListener('click', () => {
        modal.close();
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.close();
        }
    });
}

// Recupération du token de connexion.
function checkLogin() {
    const logout = document.querySelector('.login');
    storedToken = localStorage.getItem('token');

    if (storedToken) {
        logout.innerHTML = 'logout';
        document.querySelector('.top-bar').style.display = 'flex';
        document.querySelector('.btn-modify').style.display = 'flex';

        logout.addEventListener('click', () => {
            localStorage.removeItem('token');
            window.location.href = "./connection.html";
        });
    } else {
        logout.innerHTML = 'login';
        logout.addEventListener('click', () => {
            window.location.href = "./connection.html";
        });
    };
}

getProjects();
getCategories();
showModal2();
manageProject();
checkLogin();