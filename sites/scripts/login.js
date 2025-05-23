const form = document.getElementById('loginform');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await axios.post('http://unimarket.us-east-1.elasticbeanstalk.com/login/', {
            email,
            password
        });

        if (response.status === 200) {
            // alert('You have been logged in successfully!');
            sessionStorage.setItem('userKey', response.data.userKey);
            sessionStorage.setItem('userID', response.data.userID);
            window.location.href = 'dashboard.html';
        } else {
            alert(response.data.message || 'Registration failed.');
        }
    } catch (err) {
        console.error('Error:', err);
        alert(err.response?.data?.message || 'An error occurred.');
    }
});