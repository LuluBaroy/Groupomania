'use strict';

module.exports = (sequelize, Datatypes) => {
	const Posts = sequelize.define('Posts', {
		id: {
			type: Datatypes.INTEGER,
			primaryKey: true,
			unique: true,
			allowNull: false,
			autoIncrement: true
		},
		title: {
			type: Datatypes.STRING(50),
			required: true
		},
		content: {
			type: Datatypes.TEXT,
			required: true
		},
		user_id: {
			type: Datatypes.INTEGER,
			required: true
		},
		url_gif: {
			type: Datatypes.STRING,
			allowNull: false
		},
		alt_gif: {
			type: Datatypes.STRING(45),
			allowNull: true
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
	});
	Posts.associate = (models) => {
		Posts.belongsTo(models.Users, {
			foreignKey: {
				allowNull: false
			}
		})
		Posts.hasMany(models.Likes, { foreignKey: 'post_id'}, { onDelete: 'cascade' })
		Posts.hasMany(models.Comments, { foreignKey: 'post_id'}, { onDelete: 'cascade' })
		Posts.hasMany(models.PostsReport, { foreignKey: 'post_id'}, { onDelete: 'cascade' })
	}
	return Posts;
}