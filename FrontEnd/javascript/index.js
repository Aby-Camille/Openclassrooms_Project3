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

        const icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        icon.classList.add('svg-icon');
        icon.innerHTML = `
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
            console.log(trashBtn.id)
        });

        const figure = document.createElement('figure');
        figure.appendChild(img);
        figure.appendChild(figcaption);
        figure.appendChild(trashBtn);
        trashBtn.appendChild(icon);
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