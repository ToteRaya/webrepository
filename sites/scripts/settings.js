const getUserInfo = async () => {
     const userID = sessionStorage.getItem('userID');
     if (!userID) {
          window.location.href = 'login.html';
     }
     try {
          const token = await getToken();

          const response = await axios.get('https://api.example.com/user/getUserInfo', {
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