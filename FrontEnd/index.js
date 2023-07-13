const init = async function() {
    const response = await fetch('http://localhost:5678/api/works');
    const works = await response.json();
    console.log(works);

    const gallery = document.querySelector(".gallery");
    gallery.innerHTML = works.toString();
    
    works.forEach(work => {
        console.log(work);
    });
    
        let img = document.createElement('img');
        img.src = "http://localhost:5678/images/abajour-tahina1651286843956.png";
        document.getElementById('portfolio').appendChild(img);
        down.innerHTML = "Abajour Tahina";
}


init();

fetch('http://localhost:5678/api/categories')
    .then(res => res.json())
    .then (data => console.log(data))


