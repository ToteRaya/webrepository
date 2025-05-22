window.addEventListener('DOMContentLoaded', () => {
     const userKey = sessionStorage.getItem('userKey');
     if (!userKey) {
          window.location.href = 'login.html';
     } 
});