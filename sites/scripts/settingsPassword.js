const form = document.getElementById('passwordUpdate');

//MAKE SCRIPT TO VERIFY IF THE USER ID IS THE SAME AS THE INPUT EMAIL



form.addEventListener('submit', async (e) => {
     e.preventDefault();

     const inputEmail = document.getElementById('email').value;
     const oldPassword = document.getElementById('oldPassword').value;
     const newPassword = document.getElementById('newPassword').value;
     const confirmNewPassword = document.getElementById('confirmNewPassword').value;

     if (newPassword !== confirmNewPassword) {
          alert('New password and confirmation do not match.');
          return;
     }
     

     try {
          const token = await getToken();

          const userInfo = await axios.get('http://unimarket.us-east-1.elasticbeanstalk.com/user/getUserInfo', {
               headers: {
                    userID: sessionStorage.getItem('userID'),
                    Authorization: `Bearer ${token}`
               }
          });

          const storedEmail = userInfo.data.info.email;

          if (inputEmail !== storedEmail) {
               alert('The email you entered does not match your account email.');
               return;
           }

          const response = await axios.post('http://unimarket.us-east-1.elasticbeanstalk.com/user/updatePass', {
               email:inputEmail,
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
