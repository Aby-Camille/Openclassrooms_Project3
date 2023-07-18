
const getCategories = async function() {
    const response = await fetch('http://localhost:5678/api/categories');
    const categories = await response.json();
    console.log(categories);

    categories.forEach(category => {
        console.log(category);
    })
}

const getProjects = async function() {
    const response = await fetch('http://localhost:5678/api/works');
    const projects = await response.json();
    console.log(projects);

    const gallery = document.querySelector('.gallery');

    gallery.innerHTML = '';
  
    projects.forEach(project => {
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
