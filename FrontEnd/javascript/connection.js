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

        if (promise.ok === true) {
            const response = await promise.json();
            const token = response.token;
            localStorage.setItem('token', token);
            window.location.href = './index.html';
        } else {
            alert("Erreur d'identifiant ou de mot de passe");
        }
    };

    fetchUser()
});