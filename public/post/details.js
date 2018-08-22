let postID, username, jwtToken;

$(document).ready(onReady);

function onReady() {
	checkAuthentication();
	$('#post-details').on('click', '#edit-post-btn', onEditPostBtnClick);
	$.getJSON('/api/post', getPostDetails);
}

function getPostDetails(posts) {
	// see public/utils.js
	postID = getQueryStringParam('id');
	const postToRender = posts.find(post => post.id == postID);
	renderPost(postToRender);
}

function renderPost(post) {
	let editButton = '';
	if (post.author === username) {
		editButton = '<br><button id="edit-post-btn">Edit Post</button>';
	}
	$('#post-details').html(`
		${editButton}
		<h1>${post.title}</h1>
		<h4>${post.author} | ${new Date(post.created).toLocaleString()}</h4>
		<p>${post.content}</p>
	`);
}

function onEditPostBtnClick(event) {
	event.preventDefault();
	window.open(`/post/edit.html?id=${postID}`, '_self');
}

function checkAuthentication() {
	jwtToken = localStorage.getItem('jwtToken');
	if (jwtToken) {
		username = localStorage.getItem('username');
	}
}