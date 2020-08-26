'use strict';

module.exports = (sequelize, Datatypes) => {
	const CommentsReport = sequelize.define('CommentsReport', {
		id: {
			type: Datatypes.INTEGER,
			primaryKey: true,
			unique: true,
			allowNull: false,
			autoIncrement: true
		},
		comment_id: {
			type: Datatypes.INTEGER,
			required: true
		},
		user_id: {
			type: Datatypes.INTEGER,
			required: true
		},
		report: {
			type: Datatypes.TEXT,
			required: true,
			allowNull: false
		},
		status:{
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
	CommentsReport.associate = (models) => {
		CommentsReport.belongsTo(models.Users, {
			foreignKey: {
				allowNull: false
			}
		})
		CommentsReport.belongsTo(models.Comments, {
			foreignKey: {
				allowNull: false
			}
		})
	}
	return CommentsReport;
}