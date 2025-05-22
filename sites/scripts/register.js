window.addEventListener('DOMContentLoaded', () => {
    sessionStorage.removeItem('userKey');
});
  
const form = document.getElementById('registerForm');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const lastname = document.getElementById('lastname').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await axios.post('http://unimarket.us-east-1.elasticbeanstalk.com/login/register', {
            name,
            lastname,
            email,
            password
        });

        if (response.status === 200) {
            alert('You have been registered successfully!');
            window.location.href = 'sites/login.html';
        } else {
            alert(response.data.message || 'Registration failed.');
        }
    } catch (err) {
        console.error('Error:', err);
        alert(err.response?.data?.message || 'An error occurred.');
    }
});