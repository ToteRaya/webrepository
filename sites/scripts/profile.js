document.addEventListener("DOMContentLoaded", async () => {
     const userID = sessionStorage.getItem("userID");
     const container = document.getElementById("userPosts");

     try {
          const token = await getToken();
          const response = await axios.get(
               "http://unimarket.us-east-1.elasticbeanstalk.com/content/getUserPosts",
               {
                    headers: {
                         Authorization: `Bearer ${token}`,
                         userID: userID
                    }
               }
             );

          const posts = response.data;

          if (!posts.length) {
               container.innerHTML = "<p>No posts found.</p>";
               return;
          }

          posts.forEach((post) => {
               // Aqui puedes agregar clases o estilos
               const postDiv = document.createElement("div");
               postDiv.classList.add("post");

               postDiv.innerHTML = `
           <h3>${post.title}</h3>
           <p>${post.description}</p>
           <p>Price: $${post.price}</p>
           <p>Quantity: ${post.quantity}</p>
           <p>Available: ${formatTime(post.availableFrom)} - ${formatTime(post.availableTo)}</p>
           <div>
             ${post.images.map(img => `<img class="post-image" src="${img}" width="200" style="margin: 10px;" />`).join('')}
           </div>
          <span class="status">
            ${post.active ? 'Active' : 'Inactive'}
          </span>
           <div class="button-row">
               <button onclick="editPost(${post.postID})">Edit</button>
               <button onclick="deletePost(${post.postID})">Delete</button>
               <button onclick="toggleAvailability(${post.postID})">Toggle Availability</button>
          </div>

         `;

               container.appendChild(postDiv);
          });
     } catch (error) {
          console.error("Error fetching posts:", error);
          container.innerHTML = "<p>Error loading posts.</p>";
     }
});

function formatTime(timeInt) {
     const hours = Math.floor(timeInt / 100);
     const minutes = timeInt % 100;
     return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

function editPost(postID) {
     sessionStorage.setItem("postID", postID);
     window.location.href = "postEdit.html";
}
   
async function deletePost(postID) {
     try {
          const token = await getToken();

          const response = await axios.post(
               "http://unimarket.us-east-1.elasticbeanstalk.com/create/deletePost",
               { postID },
               {
                    headers: {
                         Authorization: `Bearer ${token}`
                    }
               }
          );

          alert("Post deleted successfully.");
          window.location.reload();
     } catch (error) {
          console.error("Error deleting post:", error);
          alert("Error deleting post.");
     }
}

async function toggleAvailability(postID) {
     try {
          const token = await getToken();

          const response = await axios.post(
               "http://unimarket.us-east-1.elasticbeanstalk.com/create/togglePost",
               { postID },
               {
                    headers: {
                         Authorization: `Bearer ${token}`
                    }
               }
          );

          alert("Post availability toggled successfully.");
          window.location.reload();
     } catch (error) {
          console.error("Error toggling post availability:", error);
          alert("Error toggling post availability.");
     }
}
 