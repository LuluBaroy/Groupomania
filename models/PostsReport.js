'use strict';

module.exports = (sequelize, Datatypes) => {
	const PostsReport = sequelize.define('PostsReport', {
		id: {
			type: Datatypes.INTEGER,
			primaryKey: true,
			unique: true,
			allowNull: false,
			autoIncrement: true
		},
		post_id: {
			type: Datatypes.INTEGER,
			required: true
		},
		user_id: {
			type: Datatypes.INTEGER,
			required: true
		},
		report: {
			type: Datatypes.TEXT,
			required: true
		},
		status: {
			type: Datatypes.STRING(7),
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
	PostsReport.associate = (models) => {
		PostsReport.belongsTo(models.Users, {
			foreignKey: {
				allowNull: false
			}
		})
		PostsReport.belongsTo(models.Posts, {
			foreignKey: {
				allowNull: false
			}
		})
	}
	return PostsReport;
}