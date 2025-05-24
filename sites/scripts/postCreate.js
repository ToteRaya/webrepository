const availableFrom = document.getElementById('availableFrom');
const availableTo = document.getElementById('availableTo');

const form = document.getElementById('postCreate');

function validateTimeRange() {
     const from = availableFrom.value;
     const to = availableTo.value;

     if (from && to && to < from) {
          alert("The 'Available To' time must not be earlier than 'Available From'.");
          availableTo.value = '';
     }
}

availableFrom.addEventListener('change', validateTimeRange);
availableTo.addEventListener('change', validateTimeRange);

document.addEventListener("DOMContentLoaded", async () => {
     const categoryContainer = document.getElementById("categoryChecklist");
     const form = document.querySelector("form"); // Make sure this targets your actual form

     try {
          const token = await getToken(); // Replace with your actual token retrieval function

          const response = await axios.get("http://unimarket.us-east-1.elasticbeanstalk.com/content/getCategories", {
               headers: {
                    Authorization: `Bearer ${token}`
               }
          });

          const categories = response.data;

          categories.forEach(category => {
               const checkbox = document.createElement("input");
               checkbox.type = "checkbox";
               checkbox.name = "categories";
               checkbox.value = category.categoryID;
               checkbox.id = `category-${category.categoryID}`;

               const label = document.createElement("label");
               label.htmlFor = checkbox.id;
               label.textContent = category.name;

               const div = document.createElement("div");
               div.appendChild(checkbox);
               div.appendChild(label);

               categoryContainer.appendChild(div);
          });

          // Add required validation on submit
          form.addEventListener("submit", (e) => {
               const checkboxes = form.querySelectorAll('input[name="categories"]');
               const oneChecked = Array.from(checkboxes).some(cb => cb.checked);
               if (!oneChecked) {
                    e.preventDefault();
                    alert("Please select at least one category.");
               }
          });

     } catch (error) {
          console.error("Failed to load categories:", error);
          categoryContainer.textContent = "Failed to load categories.";
     }
});
 

form.addEventListener('submit', async (e) => {
     e.preventDefault();

     const title = document.getElementById('title').value;
     const description = document.getElementById('description').value;
     const price = document.getElementById('price').value;
     const quantity = document.getElementById('quantity').value;
     const availableFrom = document.getElementById('availableFrom').value;
     const availableTo = document.getElementById('availableTo').value;
     const categories = Array.from(document.querySelectorAll('input[name="categories"]:checked')).map(cb => cb.value);
     const imageFile = document.getElementById('imageInput').files[0];

     try {
          const token = await getToken();

          // Convert time (e.g. "08:00") to 4-digit number (e.g. 800)
          const convertTime = (timeStr) => {
               const [hours, minutes] = timeStr.split(':');
               return parseInt(hours + minutes).toString().padStart(4, '0');
          };

          const fromTime = convertTime(availableFrom);
          const toTime = convertTime(availableTo);

     
          const formData = new FormData();
          formData.append("title", title);
          formData.append("description", description);
          formData.append("price", price);
          formData.append("quantity", quantity);
          formData.append("availableFrom", fromTime);
          formData.append("availableTo", toTime);
          categories.forEach(cat => formData.append("categories", cat));
          formData.append("files", imageFile);


          console.log("Form Data:", formData);
          console.log(cat => formData.append("categories", cat));

          await axios.post('http://unimarket.us-east-1.elasticbeanstalk.com/create/postPost', formData, {
               headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
               }
          });


          alert("Post submitted successfully!");
          // Optionally reset the form here
          // form.reset();

     } catch (error) {
          console.error("Failed to submit post:", error);
          alert("An error occurred while submitting the post.");
     }
});
 