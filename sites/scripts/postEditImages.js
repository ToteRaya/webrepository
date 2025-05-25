const postID = sessionStorage.getItem('postID');
const imageContainer = document.querySelector('.imageContainer');
const addImageButton = document.querySelector('button');

document.addEventListener("DOMContentLoaded", async () => {
     await loadPostImages();
});

// Load and display images
async function loadPostImages() {
     try {
          const token = await getToken();
          const response = await axios.get(
               'http://unimarket.us-east-1.elasticbeanstalk.com/content/getPostInfo',
               {
                    headers: {
                         'Authorization': `Bearer ${token}`,
                         'postID': postID
                    }
               }
          );

          const images = response.data.images || [];

          imageContainer.innerHTML = ''; // clear any previous content

          images.forEach(fileName => {
               const imageWrapper = document.createElement('div');
               imageWrapper.style.marginBottom = '10px';

               const img = document.createElement('img');
               img.src = fileName;
               img.alt = 'Post image';
               img.style.maxWidth = '200px';

               const removeBtn = document.createElement('button');
               removeBtn.textContent = 'Remove';
               removeBtn.onclick = () => deletePostImage(fileName);

               imageWrapper.appendChild(img);
               imageWrapper.appendChild(removeBtn);
               imageContainer.appendChild(imageWrapper);
          });

     } catch (error) {
          console.error("Failed to load post images:", error);
     }
}

// Delete image
async function deletePostImage(fileName) {
     try {
          const token = await getToken();
          await axios.post(
               'http://unimarket.us-east-1.elasticbeanstalk.com/create/deletePostimage',
               {
                    postID,
                    fileName
               },
               {
                    headers: {
                         'Authorization': `Bearer ${token}`
                    }
               }
          );
          await loadPostImages();
     } catch (error) {
          console.error("Failed to delete image:", error);
          alert("Could not delete image.");
     }
}
