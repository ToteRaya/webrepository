document.addEventListener("DOMContentLoaded", async () => {
     try {
          const token = await getToken();

          // Format current time as HHMM
          const now = new Date();
          const hours = now.getHours().toString().padStart(2, '0');
          const minutes = now.getMinutes().toString().padStart(2, '0');
          const formattedTime = `${hours}${minutes}`;

          const postsContainer = document.getElementById("posts");
          const categorySelect = document.getElementById("categorySelect");

          // Utility: Create post card with post and user data
          const createPostCard = (post, userInfo) => {
               const postDiv = document.createElement("div");
               postDiv.classList.add("post-card");

               const title = document.createElement("h3");
               title.textContent = post.title;
               title.classList.add("post-title");

               const desc = document.createElement("p");
               desc.textContent = post.description;
               desc.classList.add("post-description");

               const price = document.createElement("p");
               price.textContent = `Price: $${post.price}`;
               price.classList.add("post-price");

               const quantity = document.createElement("p");
               quantity.textContent = `Quantity: ${post.quantity}`;
               quantity.classList.add("post-quantity");

               const formatTime = (timeInt) => {
                    const str = timeInt.toString().padStart(4, '0');
                    let hours = parseInt(str.slice(0, 2), 10);
                    const minutes = str.slice(2);
                    const ampm = hours >= 12 ? 'PM' : 'AM';
                    hours = hours % 12 || 12; // convert to 12-hour format
                    return `${hours}:${minutes} ${ampm}`;
               };

               const time = document.createElement("p");
               const fromTime = formatTime(post.availableFrom);
               const toTime = formatTime(post.availableTo);
               time.textContent = `Available from ${fromTime} to ${toTime}`;
               time.classList.add("post-time");
                

               const user = document.createElement("p");
               user.innerHTML = `
               <strong>Seller:</strong> ${userInfo.name} ${userInfo.lastname} <br>
               <strong>Email:</strong> ${userInfo.email}`;
               user.classList.add("post-user");

               const imageContainer = document.createElement("div");
               imageContainer.classList.add("image-container");

               post.images.forEach(filename => {
                    const img = document.createElement("img");
                    img.src = `${filename}`;
                    img.alt = post.title;
                    img.classList.add("post-image");
                    imageContainer.appendChild(img);
               });

               postDiv.appendChild(title);
               postDiv.appendChild(desc);
               postDiv.appendChild(user);
               postDiv.appendChild(price);
               postDiv.appendChild(quantity);
               postDiv.appendChild(time);
               postDiv.appendChild(imageContainer);

               return postDiv;
          };

          // Fetch and render posts based on category
          const fetchAndRenderPosts = async (categoryID = '') => {
               try {
                    postsContainer.innerHTML = ""; // Clear previous posts

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

                    // const postIDs = postIDsResponse.data;

                    let postIDs = postIDsResponse.data;

                    // Shuffle the array using Fisher-Yates algorithm
                    for (let i = postIDs.length - 1; i > 0; i--) {
                         const j = Math.floor(Math.random() * (i + 1));
                         [postIDs[i], postIDs[j]] = [postIDs[j], postIDs[i]];
                    }


                    for (const postObj of postIDs) {
                         const postID = postObj.postID;

                         // Fetch post info
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

                         // Fetch user info using post.userID
                         const userInfoResponse = await axios.get(
                              'http://unimarket.us-east-1.elasticbeanstalk.com/user/getUserInfo',
                              {
                                   headers: {
                                        Authorization: `Bearer ${token}`,
                                        userID: post.userID
                                   }
                              }
                         );

                         const userInfo = userInfoResponse.data.info;

                         // Create and render post card
                         const postCard = createPostCard(post, userInfo);
                         postsContainer.appendChild(postCard);
                    }
               } catch (error) {
                    console.error("Error fetching posts:", error);
               }
          };

          // Load categories into dropdown
          const loadCategories = async () => {
               try {
                    const categoryResponse = await axios.get(
                         'http://unimarket.us-east-1.elasticbeanstalk.com/content/getCategories',
                         {
                              headers: {
                                   Authorization: `Bearer ${token}`
                              }
                         }
                    );

                    const categories = categoryResponse.data;

                    categories.forEach(cat => {
                         const option = document.createElement("option");
                         option.value = cat.categoryID;
                         option.textContent = cat.name;
                         categorySelect.appendChild(option);
                    });
               } catch (error) {
                    console.error("Error loading categories:", error);
               }
          };

          // Handle category selection
          categorySelect.addEventListener('change', async (event) => {
               const selectedCategoryID = event.target.value;
               await fetchAndRenderPosts(selectedCategoryID);
          });

          // Initial load
          await loadCategories();
          await fetchAndRenderPosts();

     } catch (error) {
          console.error("Initialization error:", error);
     }
});
 