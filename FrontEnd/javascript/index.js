const getCategories = async function() {
    const response = await fetch('http://localhost:5678/api/categories');
    const categories = await response.json();
    console.log(categories);

    const filters = document.querySelector('.filters');

    filters.innerHTML = '';

    const all = {id: 0, name: 'Tous'};
    categories.unshift(all);

    categories.forEach(category => {
        const button = document.createElement('button');
        button.innerHTML = category.name;
        button.id = category.id;

        filters.appendChild(button);

        button.addEventListener('click', (event) => {
            const buttonClicked = event.target;
            // console.log(buttonClicked.innerHTML);
            // console.log(buttonClicked.id);
            
           if (category.id === 0) {
            displayProjects(rawProjects);
            return;
           }

            displayProjects(
                rawProjects.filter(project => project.category.id === category.id)
                );
        })
    })
}

const getProjects = async function() {
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

getCategories();
getProjects();
