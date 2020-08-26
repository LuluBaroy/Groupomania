'use strict';

module.exports = (sequelize, Datatypes) => {
	const Likes = sequelize.define('Likes', {
		user_id: {
			type: Datatypes.INTEGER,
			required: true,
			references: {
				model: 'Users',
				key: 'id'
			}
		},
		post_id: {
			type: Datatypes.INTEGER,
			required: true,
			references: {
				model: 'Posts',
				key: 'id'
			}
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
	Likes.associate = (models) => {
		Likes.belongsTo(models.Users, {
			foreignKey: 'user_id',
			as: 'users'
		})
		Likes.belongsTo(models.Posts, {
			foreignKey: 'post_id',
			as: 'posts'
		})
	}
	return Likes;
}