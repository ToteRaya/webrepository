window.addEventListener('DOMContentLoaded', () => {
     const userKey = sessionStorage.getItem('userKey');
     const userID = sessionStorage.getItem('userID');
     if (!userKey || !userKey) {
          window.location.href = 'login.html';
     }
});

const getToken = async () => {
     const userKey = sessionStorage.getItem('userKey');
     try {
          const response = await axios.get('http://unimarket.us-east-1.elasticbeanstalk.com/login/getToken', {
               headers: {
                    userKey: userKey
               }
          });

          // console.log('Token fetched successfully:', response.data.token);
          return response.data.token;
     } catch (error) {
          console.error('Error fetching token:', error);
          throw error;
     }
};