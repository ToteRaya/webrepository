const form = document.getElementById('editPostForm');
const postID = sessionStorage.getItem('postID');

function formatTime4Digit(num) {
     const str = num.toString().padStart(4, '0'); // Ensure it's 4 digits
     const hours = str.substring(0, 2);
     const minutes = str.substring(2, 4);
     return `${hours}:${minutes}`;
}

document.addEventListener("DOMContentLoaded", async () => {
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

          const post = response.data;

          // Populate the form fields with data
          document.getElementById('title').value = post.title || '';
          document.getElementById('description').value = post.description || '';
          document.getElementById('quantity').value = post.quantity || 0;
          document.getElementById('price').value = post.price || 0;
          document.getElementById('availableFrom').value = formatTime4Digit(post.availableFrom || 0);
          document.getElementById('availableTo').value = formatTime4Digit(post.availableTo || 0);

     } catch (error) {
          console.error("Failed to fetch post info:", error);
     }
});
 
form.addEventListener('submit', async (e) => {
     e.preventDefault();

     const title = document.getElementById('title').value;
     const description = document.getElementById('description').value;
     const quantity = parseInt(document.getElementById('quantity').value);
     const price = parseFloat(document.getElementById('price').value);
     const availableFrom = convertTimeToNumber(document.getElementById('availableFrom').value);
     const availableTo = convertTimeToNumber(document.getElementById('availableTo').value);

     try {
          const token = await getToken();

          const response = await axios.post(
               'http://unimarket.us-east-1.elasticbeanstalk.com/create/editPost',
               {
                    postID,
                    title,
                    description,
                    quantity,
                    price,
                    availableFrom,
                    availableTo
               },
               {
                    headers: {
                         'Authorization': `Bearer ${token}`,
                         'Content-Type': 'application/json'
                    }
               }
          );

          alert("Post updated successfully!");
          // Optional: Redirect or reload
          // window.location.href = "/dashboard.html";

     } catch (error) {
          console.error("Failed to update post:", error);
          alert("Update failed. Please try again.");
     }
});

// Converts "HH:MM" to 4-digit number like 930, 1630
function convertTimeToNumber(timeStr) {
     const [hours, minutes] = timeStr.split(':');
     return parseInt(`${hours}${minutes}`);
}
    
