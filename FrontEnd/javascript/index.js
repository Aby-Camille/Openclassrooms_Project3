let rawProjects = [];

// filtrage des projets par catégories.
const getCategories = async function () {
    const response = await fetch('http://localhost:5678/api/categories');
    const categories = await response.json();
    console.log(categories);

    const filters = document.querySelector('.filters');
    filters.innerHTML = '';
    filters.addEventListener('click', (e) => {
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

// Récupération des projets sur la fenêtre de boite modale.
const getWorks = async function () {
    const response = await fetch('http://localhost:5678/api/works');
    rawProjects = await response.json();
    console.log(rawProjects);

    displayWorks(rawProjects);

}

function displayWorks(projects) {
    const modalContent = document.querySelector('.modal-content');
    
    projects.forEach((project) => {
        const figure = document.createElement('figure');
        const img = document.createElement('img');
        img.src = project.imageUrl;
        img.alt = project.title;
        img.classList.add('modal-image');
        
        const figcaption = document.createElement('figcaption');
        figcaption.innerHTML = project.title;
        figcaption.innerHTML = "éditer";
        
        figure.appendChild(img);
        figure.appendChild(figcaption);
        modalContent.appendChild(figure);
    });
}

// Gestion de la fenêtre de boite modale.
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
        // console.log(e.target);
        if (e.target === modal) {
            modal.close();
        }
    });
}

// page de connexion stockage du token.
function checkLogin() {
    const storedToken = localStorage.getItem('token');
    const logout = document.querySelector('.login');

    if (storedToken) {
        logout.innerHTML = 'logout';
        document.querySelector('.top-bar').style.display = 'flex';
        // const topBar = document.querySelector('.top-bar');
        // topBar.style.display = 'flex';

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
getWorks();
manageProject();
checkLogin();