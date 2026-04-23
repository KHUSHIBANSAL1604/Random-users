var allUsers = [];
var currentPage = 1;
var currentModalUser = null;
var USERS_PER_PAGE = 10;

$(document).ready(function () {
    if ($('#user-grid').length) fetchUsers();
    if ($('#user-details').length) renderUserDetails();

    $('#modal-close').on('click', closeModal);
    $('#modal-overlay').on('click', function (e) {
        if (e.target === this) closeModal();
    });
    $(document).on('keydown', function (e) {
        if (e.key === 'Escape') closeModal();
    });

    $('#prev-btn').on('click', function () {
        if (currentPage > 1) renderPage(currentPage - 1);
    });
    $('#next-btn').on('click', function () {
        var total = Math.ceil(allUsers.length / USERS_PER_PAGE);
        if (currentPage < total) renderPage(currentPage + 1);
    });
});

function fetchUsers() {
    $.getJSON('https://randomuser.me/api/?results=50&seed=hakarux2024', function (data) {
        allUsers = data.results;
        renderPage(1);
    }).fail(function () {
        $('#user-grid').html(
            '<div class="loading-state"><p>Failed to load users. Please refresh.</p></div>'
        );
    });
}

function renderPage(page) {
    currentPage = page;
    var start = (page - 1) * USERS_PER_PAGE;
    var pageUsers = allUsers.slice(start, start + USERS_PER_PAGE);
    var totalPages = Math.ceil(allUsers.length / USERS_PER_PAGE);

    var html = '';
    $.each(pageUsers, function (i, user) {
        var idx = start + i;
        html += '<div class="user-card" data-index="' + idx + '" style="animation-delay:' + (i * 0.055) + 's">' +
            '<div class="card-image-wrapper">' +
                '<img src="' + user.picture.large + '" alt="' + esc(user.name.first) + ' ' + esc(user.name.last) + '" loading="lazy">' +
                '<div class="image-overlay">' +
                    '<i class="fas fa-info-circle"></i>' +
                    '<span>Know About</span>' +
                '</div>' +
            '</div>' +
            '<div class="card-body">' +
                '<h2>' + esc(user.name.first) + ' ' + esc(user.name.last) + '</h2>' +
                '<div class="card-meta">' +
                    '<span class="meta-badge location"><i class="fas fa-map-marker-alt"></i> ' + esc(user.location.country) + '</span>' +
                    '<span class="meta-badge age"><i class="fas fa-user"></i> ' + user.dob.age + '</span>' +
                '</div>' +
            '</div>' +
            '<button class="view-profile-btn"><i class="fas fa-eye"></i> View Profile</button>' +
        '</div>';
    });

    $('#user-grid').html(html);
    $('#page-info').text('Page ' + page + ' of ' + totalPages);
    $('#prev-btn').prop('disabled', page === 1);
    $('#next-btn').prop('disabled', page === totalPages);

    $('#user-grid')
        .off('click.grid')
        .on('click.grid', '.card-image-wrapper', function () {
            var idx = $(this).closest('.user-card').data('index');
            openModal(allUsers[idx]);
        })
        .on('click.grid', '.view-profile-btn', function () {
            var idx = $(this).closest('.user-card').data('index');
            localStorage.setItem('selectedUser', JSON.stringify(allUsers[idx]));
            window.location.href = 'user-details.html';
        });

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function openModal(user) {
    currentModalUser = user;
    var html =
        '<div class="modal-user-profile">' +
            '<img src="' + user.picture.large + '" alt="' + esc(user.name.first) + '">' +
            '<h2>' + esc(user.name.title) + ' ' + esc(user.name.first) + ' ' + esc(user.name.last) + '</h2>' +
            '<p class="modal-username">@' + esc(user.login.username) + '</p>' +
            '<div class="modal-info-grid">' +
                infoItem('fas fa-envelope', 'Email', user.email) +
                infoItem('fas fa-phone', 'Phone', user.phone) +
                infoItem('fas fa-city', 'City', user.location.city) +
                infoItem('fas fa-flag', 'Country', user.location.country) +
                infoItem('fas fa-birthday-cake', 'Age', user.dob.age + ' years') +
                infoItem('fas fa-venus-mars', 'Gender', cap(user.gender)) +
            '</div>' +
            '<button class="full-profile-btn" id="full-profile-btn">' +
                '<i class="fas fa-id-card"></i> View Full Profile' +
            '</button>' +
        '</div>';

    $('#modal-content').html(html);
    $('#modal-overlay').addClass('active');
    $('body').addClass('modal-open');

    $('#full-profile-btn').off('click').on('click', function () {
        localStorage.setItem('selectedUser', JSON.stringify(currentModalUser));
        window.location.href = 'user-details.html';
    });
}

function closeModal() {
    $('#modal-overlay').removeClass('active');
    $('body').removeClass('modal-open');
}

function infoItem(icon, label, value) {
    return '<div class="info-item">' +
        '<i class="' + icon + '"></i>' +
        '<div>' +
            '<span class="info-label">' + label + '</span>' +
            '<span class="info-value">' + esc(String(value)) + '</span>' +
        '</div>' +
    '</div>';
}

function renderUserDetails() {
    var raw = localStorage.getItem('selectedUser');
    if (!raw) {
        $('#user-details').html('<p style="color:white;text-align:center;padding:40px;">User not found. <a href="index.html" style="color:#ffd700;">Go back</a></p>');
        return;
    }
    var user = JSON.parse(raw);
    var html =
        '<div class="user-profile">' +
            '<div class="profile-banner"></div>' +
            '<div class="profile-body">' +
                '<div class="profile-avatar">' +
                    '<img src="' + user.picture.large + '" alt="' + esc(user.name.first) + '">' +
                '</div>' +
                '<div class="profile-name-section">' +
                    '<h1>' + esc(user.name.title) + ' ' + esc(user.name.first) + ' ' + esc(user.name.last) + '</h1>' +
                    '<p class="profile-username">@' + esc(user.login.username) + '</p>' +
                '</div>' +
                '<div class="profile-info-grid">' +
                    profileItem('fas fa-envelope', 'Email', user.email) +
                    profileItem('fas fa-phone', 'Phone', user.phone) +
                    profileItem('fas fa-map-marker-alt', 'Location', user.location.city + ', ' + user.location.country) +
                    profileItem('fas fa-birthday-cake', 'Age', user.dob.age + ' years old') +
                    profileItem('fas fa-venus-mars', 'Gender', cap(user.gender)) +
                    profileItem('fas fa-flag', 'Nationality', user.nat) +
                    profileItem('fas fa-road', 'Street', user.location.street.number + ' ' + user.location.street.name) +
                    profileItem('fas fa-mail-bulk', 'Postcode', String(user.location.postcode)) +
                '</div>' +
            '</div>' +
        '</div>';
    $('#user-details').html(html);
}

function profileItem(icon, label, value) {
    return '<div class="profile-info-item">' +
        '<i class="' + icon + '"></i>' +
        '<div>' +
            '<span class="info-label">' + label + '</span>' +
            '<span class="info-value">' + esc(String(value)) + '</span>' +
        '</div>' +
    '</div>';
}

function cap(str) {
    return str ? str.charAt(0).toUpperCase() + str.slice(1) : '';
}

function esc(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}
