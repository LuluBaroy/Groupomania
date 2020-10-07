'use strict';

module.exports = (sequelize, Datatypes) => {
	const Users = sequelize.define('Users', {
		id: {
			type: Datatypes.INTEGER,
			primaryKey: true,
			unique: true,
			allowNull: false,
			autoIncrement: true
		},
		email: {
			type: Datatypes.STRING,
			allowNull: false,
			isEmail: true,
			unique: true,
			required: true
		},
		password: {
			type: Datatypes.STRING,
			required: true,
			allowNull: false
		},
		username: {
			type: Datatypes.STRING(50),
			len: [3, 50],
			required: true,
			allowNull: false
		},
		role: {
			type: Datatypes.STRING,
			allowNull: false
		},
		bio: {
			type: Datatypes.TEXT,
			allowNull: true
		},
		url_profile_picture: {
			type: Datatypes.STRING,
			allowNull: true
		},
		alt_profile_picture: {
			type: Datatypes.STRING(45),
			allowNull: true
		},
		consents: {
			type: Datatypes.STRING,
			allowNull: false
		},
		lastLogin: {
			type: Datatypes.DATE,
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
	Users.associate = (models) => {
		Users.hasMany(models.Posts,{ foreignKey: 'user_id' }, { onDelete: 'cascade' })
		Users.hasMany(models.PostsReport,{ foreignKey: 'user_id' }, { onDelete: 'cascade' })
		Users.hasMany(models.Likes,{ foreignKey: 'user_id' }, { onDelete: 'cascade' })
		Users.hasMany(models.Comments,{ foreignKey: 'user_id' }, { onDelete: 'cascade' })
		Users.hasMany(models.CommentsReport,{ foreignKey: 'user_id' }, { onDelete: 'cascade' })
	}
	return Users;
}