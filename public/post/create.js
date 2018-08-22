let username, jwtToken;

$(document).ready(onReady);

function onReady() {
	checkAuthentication();
	$('#new-post-form').on('submit', onCreateSubmit);
}

function onCreateSubmit(event) {
	event.preventDefault();
	const newPost ={
		title: $('#title-txt').val(),
		content: $('#content-txt').val()
	};
    
	// see public/utils.js
	ajax({
		method: 'POST',
		url: '/api/post',
		data: newPost,
		jwtToken: jwtToken,
		callback: post => {
			alert('Post created succesfully, redirecting ...');
			window.open(`/post/details.html?id=${post.id}`, '_self');
		}
	});
}

function checkAuthentication() {
	jwtToken = localStorage.getItem('jwtToken');
	if (jwtToken) {
		username = localStorage.getItem('username');
	} else {
		alert('You are not logged in, taking you back to home page.');
		window.open('/', '_self');
	}
}