$(document).ready(onReady);

function onReady() {
	$('#sign-up-form').submit(onSignUpSubmit);
	$('#login-form').submit(onLoginSubmit);
}

function onSignUpSubmit(event) {
	event.preventDefault();

	const userData = {
		name: $('#name-txt').val(),
		username: $('#username-txt').val(),
		password: $('#password-txt').val()
	};
    
	ajax({
		method: 'POST',
		url: '/api/user',
		data: userData,
		callback: user => {
			alert(`User "${user.username}" created, you may now log in.`);
			window.open('/login.html', '_self');
		}
	});
}

function onLoginSubmit(event) {
	event.preventDefault();

	const userData = {
		username: $('#username-txt').val(),
		password: $('#password-txt').val()
	};
    
	ajax({
		method: 'POST',
		url: '/api/user/login',
		data: userData,
		callback: response => {
			localStorage.setItem('username', userData.username);
			localStorage.setItem('jwtToken', response.authToken);
			alert('Login succesful, redirecting ...');
			window.open('/', '_self');
		}
	});
}