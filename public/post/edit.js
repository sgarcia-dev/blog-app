let postID, username, jwtToken;

$(document).ready(onReady);

function onReady() {
	checkAuthentication();
	$.getJSON('/api/post', getPostDetails);
	$('#post-edit-form').on('submit', onEditSubmit);
}

function getPostDetails(posts) {
	// see public/utils.js
	postID = getQueryStringParam('id');
	const postToRender = posts.find(post => post.id == postID);
	if (postToRender.author === username) {
		renderPost(postToRender);
	} else {
		alert('You are not the owner of this post, redirecting to homepage ...');
		window.open('/', '_self');
	}
}

function renderPost(post) {
	// Populate form fields with post data
	$('#author-txt').prop('disabled', false).val(post.author);
	$('#title-txt').prop('disabled', false).val(post.title);
	$('#content-txt').prop('disabled', false).val(post.content);
}

function onEditSubmit(event) {
	event.preventDefault();
	const newPost ={
		author: $('#author-txt').val(),
		title: $('#title-txt').val(),
		content: $('#content-txt').val()
	};
    
	// see public/utils.js
	ajax({
		method: 'PUT',
		url: `/api/post/${postID}`,
		data: newPost,
		jwtToken: jwtToken,
		callback: post => {
			alert('Post changes saved succesfully, redirecting ...');
			window.open(`/post/details.html?id=${postID}`, '_self');
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