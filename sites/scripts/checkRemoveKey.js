window.addEventListener('DOMContentLoaded', () => {
     sessionStorage.removeItem('userKey');
     sessionStorage.removeItem('userID');

     const isEditPostPage = window.location.pathname.includes('/edit-post');

     if (!isEditPostPage) {
          sessionStorage.removeItem('postID');
     }
});  