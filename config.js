'use strict';
exports.DATABASE_URL = process.env.DATABASE_URL || 'mongodb://admin:admin1234@ds045507.mlab.com:45507/travelers';
exports.TEST_DATABASE_URL = process.env.TEST_DATABASE_URL || 'mongodb://admin:admin1234@ds137102.mlab.com:37102/interview-test';
exports.PORT = process.env.PORT || 8080;
exports.JWT_SECRET = process.env.JWT_SECRET || "realnuno";
exports.JWT_EXPIRY = process.env.JWT_EXPIRY || '7d';
