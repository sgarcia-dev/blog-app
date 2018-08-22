$(document).ready(onReady);

let username, jwtToken;

function onReady() {
	checkAuthentication();
	$.getJSON('api/post', renderPosts);
	$('#post-list').on('click', '#delete-post-btn', onPostDeleteBtnClick);
	$('#post-list').on('click', '#post-summary', onPostClick);
}

function renderPosts(posts) {
	$('#post-list').html(posts.map(postToHtml).join('<hr/>'));
}

function postToHtml(post) {
	let deleteButton = '';
	if (post.author === username) {
		deleteButton = '<button id="delete-post-btn">Delete</button>';
	}
	return `
	<div id="post-summary" data-post-id="${post.id}">
		<b>author:</b> ${post.author}<br/>
		<b>title:</b> ${post.title}<br/>
		<b>created:</b> ${new Date(post.created).toLocaleString()}<br/>
		${deleteButton}
	</div>
    `;
}

// Handle opening post details
function onPostClick(event) {
	const postId = $(event.currentTarget).attr('data-post-id');
	window.open(`post/details.html?id=${postId}`, '_self');
}

// Handle deleting posts
function onPostDeleteBtnClick(event) {
	/**
	 * Because "onPostDeleteClick" and "onPostClick" both are listening for clicks inside of
	 * #post-summary element, we need to call event.stopImmediatePropagation to avoid both
	 * event listeners firing when we click on the delete button inside #post-summary.
	 */
	event.stopImmediatePropagation(); 
	// Step 1: Get the post id to delete from it's parent.
	const postID = $(event.currentTarget)
		.closest('#post-summary')
		.attr('data-post-id');
	// Step 2: Verify use is sure of deletion
	const userSaidYes = confirm('Are you sure you want to delete this post?');
	if (userSaidYes) {
		// Step 3: Make ajax call to delete post
		ajax({
			method: 'delete',
			url: `/api/post/${postID}`,
			callback: () => {
				// Step 4: If succesful, reload the posts list
				alert('Post deleted succesfully, reloading results ...');
				$.getJSON('api/post', renderPosts);
			}
		});
	}
}

function checkAuthentication() {
	jwtToken = localStorage.getItem('jwtToken');
	if (jwtToken) {
		username = localStorage.getItem('username');
		$('#nav-welcome').html(`Welcome ${username}`).removeAttr('hidden');
		$('#nav-create').removeAttr('hidden');
	} else {
		$('#nav-login').removeAttr('hidden');
	}
}