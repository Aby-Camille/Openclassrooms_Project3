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

// Affichage des projets sur la modale et gestion du boutton trash.
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

        const iconMove = document.createElement('span');
        iconMove.classList.add('font-move');
        iconMove.innerHTML = `
        <i class="fa-solid fa-up-down-left-right" style="color: #ffffff; font-size: 12px;"></i>
        `;

        const moveBtn = document.createElement('button');
        moveBtn.classList.add('btn-move');

        const iconBin = document.createElement('span');
        iconBin.classList.add('font-icon');
        iconBin.innerHTML = `
        <i class="fa-solid fa-trash-can" style="color: #ffffff; font-size: 11px;"></i>
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

// Affichage de la modale ajout de projet et preview image avant upload.
function addModal() {
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

        imageFileInput.addEventListener('change', function () {
            console.log(this.files);
            const file = this.files[0];
            if (file) {

                const reader = new FileReader();
                imgDw.style.visibility = 'visible';
                document.querySelector('.add-photo').style.visibility = 'hidden';
                document.querySelector('.img-span').style.visibility = 'hidden';
                reader.readAsDataURL(file);

                reader.addEventListener('load', function () {
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

            const fileInput = document.querySelector('input[type=file]');

            if (fileInput.files.innerHTML ==="") {
                alert('Veuillez saisir les champs');
                return;
            }

                const formData = new FormData(addWorkForm);
                console.log(formData);

                await fetch('http://localhost:5678/api/works', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${storedToken}`
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
addModal();
manageProject();
checkLogin();