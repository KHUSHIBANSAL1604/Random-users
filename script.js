$(document).ready(function() {
    if ($('#user-grid').length > 0) {
            fetchUsers();
 }
 if ($('#user-details').length > 0) {
            fetchUserDetails();
 }
});
function fetchUsers() {
 $.getJSON('https://randomuser.me/api/?results=6', function(response) {
     const users = response.results;
     let userGrid = '';

     users.forEach(user => {
         userGrid += `
             <div class="user-card">
                 <a href="user-details.html" class="user-link" data-user='${JSON.stringify(user)}'>
                     <img src="${user.picture.thumbnail}" alt="Profile Picture">
                     <h2>${user.name.first} ${user.name.last}</h2>
                 </a>
             </div>
         `;
     });

     $('#user-grid').html(userGrid);
     $('.user-link').click(function(e) {
         const userData = $(this).data('user');
                     localStorage.setItem('selectedUser', JSON.stringify(userData));
     });
 });
}
function fetchUserDetails() {
 const userData = localStorage.getItem('selectedUser');
 if (userData) {
     const user = JSON.parse(userData);

     let userDetails = `
         <div class="user-profile">
             <img src="${user.picture.large}" alt="Profile Picture">
             <h1>${user.name.first} ${user.name.last}</h1>
             <p><strong>Email:</strong> ${user.email}</p>
             <p><strong>Phone:</strong> ${user.phone}</p>
             <p><strong>Location:</strong> ${user.location.city}, ${user.location.country}</p>
             <p><strong>Age:</strong> ${user.dob.age}</p>
         </div>
     `;

     $('#user-details').html(userDetails);
 } else {
     $('#user-details').html('<p>User not found. Please go back and select a user.</p>');
 }
}