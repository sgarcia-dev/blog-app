/* global $ */
$(document).ready(onReady);

let postID;

function onReady() {
	$('#edit-post-btn').click(onEditPostBtnClick);
	$.getJSON('/api/post', getPostDetails);
}

function getPostDetails(posts) {
	// see public/utils.js
	postID = getQueryStringParam('id');
	const postToRender = posts.find(post => post.id == postID);
	renderPost(postToRender);
}

function renderPost(post) {
	$('#post-details').html(`
		<h1>${post.title}</h1>
		<h4>${post.author} | ${new Date(post.created).toLocaleString()}</h4>
		<p>${post.content}</p>
	`);
}

function onEditPostBtnClick(event) {
	event.preventDefault();
	window.open(`/post/edit.html?id=${postID}`, '_self');
}