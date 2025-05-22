const form = document.getElementById('registerForm');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const lastname = document.getElementById('lastname').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
    const response = await fetch('http://unimarket.us-east-1.elasticbeanstalk.com/login/register', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, lastname, email, password }),
    });

    const result = await response.json();
    alert(result.message);
    } catch (err) {
    console.error('Error:', err);
    alert('An error occurred.');
    }
});