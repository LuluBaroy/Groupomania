'use strict';

module.exports = (sequelize, Datatypes) => {
	const Comments = sequelize.define('Comments', {
		id: {
			type: Datatypes.INTEGER,
			primaryKey: true,
			unique: true,
			allowNull: false,
			autoIncrement: true
		},
		comment: {
			type: Datatypes.TEXT,
			required: true
		},
		user_id: {
			type: Datatypes.INTEGER,
			required: true,
			reference:{
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
	Comments.associate = (models) => {
		Comments.belongsTo(models.Users, {
			foreignKey: {
				allowNull: false
			}
		})
		Comments.belongsTo(models.Posts, {
			foreignKey: {
				allowNull: false
			}
		})
		Comments.hasMany(models.CommentsReport,{ foreignKey: 'comment_id' }, { onDelete: 'cascade' })
	}
	return Comments;
}