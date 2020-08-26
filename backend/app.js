'use strict';
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const { expressShield } = require('node-shield');
const helmet = require('helmet');
const usersRoutes = require('./routes/users');
const postsRoutes = require('./routes/posts');
const postsReportRoutes = require('./routes/postsReports');
const commentReportsRoutes = require('./routes/commentsReport');
const commentsRoutes = require('./routes/comments');
const path = require('path');

app.use(helmet());
app.use(cors());
app.use(bodyParser.json());

app.use(expressShield({
	errorHandler: (shieldError, req, res, next) => {
		console.error(shieldError);
		res.sendStatus(400);
	}
}));

app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/files', express.static(path.join(__dirname, 'files')));

app.use('/api/posts', postsRoutes);
app.use('/api/auth', usersRoutes);
app.use('/api/report', postsReportRoutes);
app.use('/api/report/comment', commentReportsRoutes);
app.use('/api/posts', commentsRoutes);
module.exports = app;