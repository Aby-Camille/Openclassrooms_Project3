document.querySelector('#connexion').addEventListener('submit', (event) => {
    event.preventDefault();

    const emailValue = document.querySelector('#email').value;
    const passwordValue = document.querySelector('#password').value;


    async function fetchUser() {
        const promise = await fetch('http://localhost:5678/api/users/login', {
            method: 'POST',
            headers: {
                'accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: emailValue,
                password: passwordValue
            })
        });

        const response = await promise.json();
        if (promise.ok) {
            const token = response.token;
            localStorage.setItem('token', token);
            window.location.replace ('./index.html');
        } else {
            alert("Erreur d'identifiant ou de mot de passe");
        }
    };
    
    fetchUser()
});

const storedToken = localStorage.getItem('token');
const logout = document.querySelector('.login');

if (storedToken) {
    logout.innerHTML = 'logout';
    logout.addEventListener('click', (e) => {
    localStorage.removeItem('token');
    window.location.href = "./connection.html";
    });
} else {
    logout.innerHTML = 'login';
    logout.addEventListener('click', (e) => {
        window.location.href = "./connection.html";
    });
};