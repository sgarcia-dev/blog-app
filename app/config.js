module.exports = {
	PORT: process.env.PORT || 8080,
	MONGO_URL: process.env.MONGO_URL || 'mongodb://localhost:27017/blog-app',
	MONGO_TEST_URL: process.env.MONGO_TEST_URL || 'mongodb://localhost:27017/test-blog-app',
	HTTP_STATUS_CODES: {
		OK: 200,
		CREATED: 201,
		NO_CONTENT: 204,
		BAD_REQUEST: 400,
		UNAUTHORIZED: 401,
		NOT_FOUND: 404,
		UNPROCESSABLE_ENTITY: 422,
		INTERNAL_SERVER_ERROR: 500,
	},
	JWT_SECRET: process.env.JWT_SECRET,
	JWT_EXPIRY: process.env.JWT_EXPIRY || '7d'
};
