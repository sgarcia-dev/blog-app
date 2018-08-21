/* global $ */
$(document).ready(onReady);

let postID;

function onReady() {
	$.getJSON('/api/post', getPostDetails);
	$('#post-edit-form').on('submit', onEditSubmit);
}

function getPostDetails(posts) {
	// see public/utils.js
	postID = getQueryStringParam('id');
	const postToRender = posts.find(post => post.id == postID);
	renderPost(postToRender);
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
		callback: post => {
			alert('Post changes saved succesfully, redirecting ...');
			window.open(`/post/details.html?id=${postID}`, '_self');
		}
	});
}