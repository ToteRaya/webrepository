const form = document.getElementById('passwordUpdate');



//MAKE SCRIPT TO VERIFY IF THE USER ID IS THE SAME AS THE INPUT EMAIL
form.addEventListener('submit', async (e) => {
     e.preventDefault();

     const email = document.getElementById('email').value;
     const oldPassword = document.getElementById('oldPassword').value;
     const newPassword = document.getElementById('newPassword').value;
     const confirmNewPassword = document.getElementById('confirmNewPassword').value;

     if (newPassword !== confirmNewPassword) {
          alert('New password and confirmation do not match.');
          return;
     }

     try {
          const token = await getToken();

          const response = await axios.post('http://unimarket.us-east-1.elasticbeanstalk.com/user/updatePass', {
               email,
               oldPassword,
               newPassword
          }, {
               headers: {
                    Authorization: `Bearer ${token}`
               }
          });

          if (response.status === 200) {
               alert('Password updated successfully!');
          } else {
               alert(response.data.message || 'Update failed.');
          }
     } catch (err) {
          console.error('Error:', err);
          alert(err.response?.data?.message || 'An error occurred.');
     }
});
