const getUserInfo = async () => {
     const userID = sessionStorage.getItem('userID');
     if (!userID) {
          window.location.href = 'login.html';
     }
     try {
          const token = await getToken();

          const response = await axios.get('http://unimarket.us-east-1.elasticbeanstalk.com/user/getUserInfo', {
               headers: {
                    userID: userID,
                    Authorization: `Bearer ${token}` 
               }
          });

          console.log('User Info:', response.data.info);
          return response.data.info;
     } catch (error) {
          console.error('Error fetching user info:', error);
     }
};

document.addEventListener('DOMContentLoaded', async () => {
     const userInfo = await getUserInfo();

     if (userInfo) {
          document.getElementById('name').textContent = userInfo.name || '';
          document.getElementById('lastname').textContent = userInfo.lastname || '';
          document.getElementById('email').textContent = userInfo.email || '';
     }
});
