$(document).ready(onReady);

function onReady() {
	$('#new-post-form').on('submit', onCreateSubmit);
}

function onCreateSubmit(event) {
	event.preventDefault();
	const newPost ={
		author: $('#author-txt').val(),
		title: $('#title-txt').val(),
		content: $('#content-txt').val()
	};
    
	// see public/utils.js
	ajax({
		method: 'POST',
		url: '/api/post',
		data: newPost,
		callback: post => {
			alert('Post created succesfully, redirecting ...');
			window.open(`/post/details.html?id=${post.id}`, '_self');
		}
	});
}
