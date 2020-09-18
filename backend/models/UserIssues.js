'use strict';

module.exports = (sequelize, Datatypes) => {
	const UserIssues = sequelize.define('UserIssues', {
		id: {
			type: Datatypes.INTEGER,
			primaryKey: true,
			unique: true,
			allowNull: false,
			autoIncrement: true
		},
		lastName: {
			type: Datatypes.STRING,
			allowNull: false,
			required: true
		},
		firstName: {
			type: Datatypes.STRING,
			allowNull: false,
			required: true
		},
		email: {
			type: Datatypes.STRING,
			allowNull: false,
			isEmail: true,
			required: true
		},
		issue: {
			type: Datatypes.STRING,
			allowNull: false,
			required: true
		},
		status: {
			type: Datatypes.STRING,
			allowNull: false
		},
		created_at: {
			type: Datatypes.DATE,
			required: true
		},
		updated_at: {
			type: Datatypes.DATE,
			allowNull: true
		}
	}, {
		underscored: true
	})
	return UserIssues
}