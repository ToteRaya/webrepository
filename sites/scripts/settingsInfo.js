const form = document.getElementById('infoUpdate');

form.addEventListener('submit', async (e) => {
     e.preventDefault();

     const name = document.getElementById('name').value;
     const lastname = document.getElementById('lastname').value;
     const email = document.getElementById('email').value;

     const userID = sessionStorage.getItem('userID');

     try {
          const token = await getToken();

          const response = await axios.post('http://unimarket.us-east-1.elasticbeanstalk.com/user/updateUser', {
               userID,
               name,
               lastname,
               email
          }, {
               headers: {
                    Authorization: `Bearer ${token}`
               }
          });

          if (response.status === 200) {
               alert('User information updated successfully!');
          } else {
               alert(response.data.message || 'Update failed.');
          }
     } catch (err) {
          console.error('Error:', err);
          alert(err.response?.data?.message || 'An error occurred.');
     }
});