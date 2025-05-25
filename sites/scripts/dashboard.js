document.addEventListener("DOMContentLoaded", async () => {
     try {
          const token = await getToken();

          // Format current time as HHMM
          const now = new Date();
          const hours = now.getHours().toString().padStart(2, '0');
          const minutes = now.getMinutes().toString().padStart(2, '0');
          const formattedTime = `${hours}${minutes}`;

          const postsContainer = document.getElementById("posts");

          // Utility: Create post card
          const createPostCard = (post) => {
               const postDiv = document.createElement("div");
               postDiv.classList.add("post-card");

               const title = document.createElement("h3");
               title.classList.add("post-title");
               title.textContent = post.title;

               const desc = document.createElement("p");
               desc.classList.add("post-description");
               desc.textContent = post.description;

               const price = document.createElement("p");
               price.classList.add("post-price");
               price.textContent = `Price: $${post.price}`;

               const time = document.createElement("p");
               time.classList.add("post-time");
               time.textContent = `Available from ${post.availableFrom} to ${post.availableTo}`;

               const quantity = document.createElement("p");
               quantity.classList.add("post-quantity");
               quantity.textContent = `Quantity: ${post.quantity}`;

               const imageContainer = document.createElement("div");
               imageContainer.classList.add("post-images");

               post.images.forEach(filename => {
                    const img = document.createElement("img");
                    img.classList.add("post-image");
                    img.src = `${filename}`;
                    img.alt = post.title;
                    imageContainer.appendChild(img);
               });

               postDiv.appendChild(title);
               postDiv.appendChild(desc);
               postDiv.appendChild(price);
               postDiv.appendChild(quantity);
               postDiv.appendChild(time);
               postDiv.appendChild(imageContainer);

               return postDiv;
          };
           

          // Fetch and display post info for given category
          const fetchAndRenderPosts = async (categoryID = '') => {
               try {
                    postsContainer.innerHTML = ""; // clear previous posts

                    const headers = {
                         Authorization: `Bearer ${token}`,
                         time: formattedTime
                    };

                    if (categoryID) {
                         headers.categories = categoryID;
                    }

                    const postIDsResponse = await axios.get(
                         'http://unimarket.us-east-1.elasticbeanstalk.com/content/getPostIDs',
                         { headers }
                    );

                    const postIDs = postIDsResponse.data;

                    for (const postObj of postIDs) {
                         const postID = postObj.postID;

                         const postInfoResponse = await axios.get(
                              'http://unimarket.us-east-1.elasticbeanstalk.com/content/getPostInfo',
                              {
                                   headers: {
                                        Authorization: `Bearer ${token}`,
                                        postID: postID
                                   }
                              }
                         );

                         const post = postInfoResponse.data;
                         const postCard = createPostCard(post);
                         postsContainer.appendChild(postCard);
                    }

               } catch (error) {
                    console.error("Error fetching posts:", error);
               }
          };

          // Fetch and populate category dropdown
          const categoryResponse = await axios.get(
               'http://unimarket.us-east-1.elasticbeanstalk.com/content/getCategories',
               {
                    headers: {
                         Authorization: `Bearer ${token}`
                    }
               }
          );

          const categories = categoryResponse.data;
          const selectElement = document.getElementById("categorySelect");

          categories.forEach(cat => {
               const option = document.createElement("option");
               option.value = cat.categoryID;
               option.textContent = cat.name;
               selectElement.appendChild(option);
          });

          // Dropdown change triggers post fetch
          selectElement.addEventListener('change', async (event) => {
               const selectedCategoryID = event.target.value;
               await fetchAndRenderPosts(selectedCategoryID);
          });

          // Initial load (all posts)
          await fetchAndRenderPosts();

     } catch (error) {
          console.error("Initialization error:", error);
     }
});
 