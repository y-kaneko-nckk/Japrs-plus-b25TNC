import { Schema } from '../src/types';

export const newSchema: Schema = {
	models: {
		Blog: {
			syncable: true,
			name: 'Blog',
			pluralName: 'Blogs',
			attributes: [
				{
					type: 'model',
					properties: {},
				},
			],
			fields: {
				id: {
					name: 'id',
					isArray: false,
					type: 'ID',
					isRequired: true,
					attributes: [],
				},
				name: {
					name: 'name',
					isArray: false,
					type: 'String',
					isRequired: true,
					attributes: [],
				},
				blogOwnerId: {
					name: 'blogOwnerId',
					isArray: false,
					type: 'String',
					isRequired: false,
					attributes: [],
				},
				posts: {
					name: 'posts',
					isArray: true,
					type: {
						model: 'Post',
					},
					isRequired: false,
					attributes: [],
					association: {
						connectionType: 'HAS_MANY',
						associatedWith: ['blog'],
					},
				},
				owner: {
					name: 'owner',
					isArray: false,
					type: {
						model: 'BlogOwner',
					},
					isRequired: true,
					attributes: [],
					association: {
						connectionType: 'BELONGS_TO',
						targetNames: ['blogOwnerId'],
					},
				},
			},
		},
		Post: {
			syncable: true,
			name: 'Post',
			pluralName: 'Posts',
			attributes: [
				{
					type: 'model',
					properties: {},
				},
			],
			fields: {
				id: {
					name: 'id',
					isArray: false,
					type: 'ID',
					isRequired: true,
					attributes: [],
				},
				title: {
					name: 'title',
					isArray: false,
					type: 'String',
					isRequired: true,
					attributes: [],
				},
				referencePostId: {
					name: 'referencePostId',
					isArray: false,
					type: 'String',
					isRequired: false,
					attributes: [],
				},
				reference: {
					name: 'reference',
					isArray: false,
					type: {
						model: 'Post',
					},
					isRequired: false,
					attributes: [],
					association: {
						connectionType: 'BELONGS_TO',
						targetNames: ['referencePostId'],
					},
				},
				blog: {
					name: 'blog',
					isArray: false,
					type: {
						model: 'Blog',
					},
					isRequired: false,
					attributes: [],
					association: {
						connectionType: 'BELONGS_TO',
						targetNames: ['postBlogId'],
					},
				},
				comments: {
					name: 'comments',
					isArray: true,
					type: {
						model: 'Comment',
					},
					isRequired: false,
					attributes: [],
					association: {
						connectionType: 'HAS_MANY',
						associatedWith: ['post'],
					},
				},
				authors: {
					name: 'authors',
					isArray: true,
					type: {
						model: 'PostAuthorJoin',
					},
					isRequired: false,
					attributes: [],
					association: {
						connectionType: 'HAS_MANY',
						associatedWith: ['post'],
					},
				},
				metadata: {
					name: 'metadata',
					isArray: false,
					type: {
						nonModel: 'PostMetadata',
					},
					isRequired: false,
					attributes: [],
				},
			},
		},
		Comment: {
			syncable: true,
			name: 'Comment',
			pluralName: 'Comments',
			attributes: [
				{
					type: 'model',
					properties: {},
				},
			],
			fields: {
				id: {
					name: 'id',
					isArray: false,
					type: 'ID',
					isRequired: true,
					attributes: [],
				},
				content: {
					name: 'content',
					isArray: false,
					type: 'String',
					isRequired: false,
					attributes: [],
				},
				commentPostId: {
					name: 'commentPostId',
					isArray: false,
					type: 'ID',
					isRequired: false,
					attributes: [],
				},
				post: {
					name: 'post',
					isArray: false,
					type: {
						model: 'Post',
					},
					isRequired: false,
					attributes: [],
					association: {
						connectionType: 'BELONGS_TO',
						targetNames: ['commentPostId'],
					},
				},
			},
		},
		Song: {
			syncable: true,
			name: 'Song',
			pluralName: 'Songs',
			attributes: [
				{
					type: 'model',
					properties: {},
				},
			],
			fields: {
				id: {
					name: 'id',
					isArray: false,
					type: 'ID',
					isRequired: true,
					attributes: [],
				},
				songID: {
					name: 'songID',
					isArray: false,
					type: 'ID',
					isRequired: true,
					attributes: [],
				},
				content: {
					name: 'content',
					isArray: false,
					type: 'String',
					isRequired: false,
					attributes: [],
				},
			},
		},
		Album: {
			syncable: true,
			name: 'Album',
			pluralName: 'Albums',
			attributes: [
				{
					type: 'model',
					properties: {},
				},
			],
			fields: {
				id: {
					name: 'id',
					isArray: false,
					type: 'ID',
					isRequired: true,
					attributes: [],
				},
				name: {
					name: 'name',
					isArray: false,
					type: 'String',
					isRequired: false,
					attributes: [],
				},
				songs: {
					name: 'songs',
					isArray: true,
					type: {
						model: 'Song',
					},
					isRequired: false,
					attributes: [],
					isArrayNullable: true,
					association: {
						connectionType: 'HAS_MANY',
						associatedWith: ['songID'],
					},
				},
			},
		},
		PostAuthorJoin: {
			syncable: true,
			name: 'PostAuthorJoin',
			pluralName: 'PostAuthorJoins',
			attributes: [
				{
					type: 'model',
					properties: {},
				},
				{
					type: 'key',
					properties: {
						name: 'byAuthor',
						fields: ['authorId'],
					},
				},
				{
					type: 'key',
					properties: {
						name: 'byPost',
						fields: ['postId'],
					},
				},
			],
			fields: {
				id: {
					name: 'id',
					isArray: false,
					type: 'ID',
					isRequired: true,
					attributes: [],
				},
				author: {
					name: 'author',
					isArray: false,
					type: {
						model: 'Author',
					},
					isRequired: false,
					attributes: [],
					association: {
						connectionType: 'BELONGS_TO',
						targetNames: ['authorId'],
					},
				},
				post: {
					name: 'post',
					isArray: false,
					type: {
						model: 'Post',
					},
					isRequired: false,
					attributes: [],
					association: {
						connectionType: 'BELONGS_TO',
						targetNames: ['postId'],
					},
				},
			},
		},
		Author: {
			syncable: true,
			name: 'Author',
			pluralName: 'Authors',
			attributes: [
				{
					type: 'model',
					properties: {},
				},
			],
			fields: {
				id: {
					name: 'id',
					isArray: false,
					type: 'ID',
					isRequired: true,
					attributes: [],
				},
				isActive: {
					name: 'isActive',
					isArray: false,
					type: 'Boolean',
					isRequired: false,
				},
				rating: {
					name: 'rating',
					isArray: false,
					type: 'Float',
					isRequired: false,
				},
				karma: {
					name: 'karma',
					isArray: false,
					type: 'Int',
					isRequired: false,
				},
				name: {
					name: 'name',
					isArray: false,
					type: 'String',
					isRequired: true,
					attributes: [],
				},
				posts: {
					name: 'posts',
					isArray: true,
					type: {
						model: 'PostAuthorJoin',
					},
					isRequired: false,
					attributes: [],
					association: {
						connectionType: 'HAS_MANY',
						associatedWith: ['author'],
					},
				},
			},
		},
		Forum: {
			syncable: true,
			name: 'Forum',
			pluralName: 'Forums',
			attributes: [
				{
					type: 'model',
					properties: {},
				},
			],
			fields: {
				id: {
					name: 'id',
					isArray: false,
					type: 'ID',
					isRequired: true,
					attributes: [],
				},
				title: {
					name: 'title',
					isArray: false,
					type: 'String',
					isRequired: true,
					attributes: [],
				},
				editors: {
					name: 'editors',
					isArray: true,
					type: {
						model: 'ForumEditorJoin',
					},
					isRequired: false,
					attributes: [],
					association: {
						connectionType: 'HAS_MANY',
						associatedWith: ['forum'],
					},
				},
			},
		},
		Editor: {
			syncable: true,
			name: 'Editor',
			pluralName: 'Editors',
			attributes: [
				{
					type: 'model',
					properties: {},
				},
			],
			fields: {
				id: {
					name: 'id',
					isArray: false,
					type: 'ID',
					isRequired: true,
					attributes: [],
				},
				name: {
					name: 'name',
					isArray: false,
					type: 'String',
					isRequired: true,
					attributes: [],
				},
				forums: {
					name: 'forums',
					isArray: true,
					type: {
						model: 'ForumEditorJoin',
					},
					isRequired: false,
					attributes: [],
					association: {
						connectionType: 'HAS_MANY',
						associatedWith: ['editor'],
					},
				},
			},
		},
		ForumEditorJoin: {
			syncable: true,
			name: 'ForumEditorJoin',
			pluralName: 'ForumEditorJoins',
			attributes: [
				{
					type: 'model',
					properties: {},
				},
				{
					type: 'key',
					properties: {
						name: 'byEditor',
						fields: ['editorID', 'forumID'],
					},
				},
				{
					type: 'key',
					properties: {
						name: 'byForum',
						fields: ['forumID', 'editorID'],
					},
				},
			],
			fields: {
				id: {
					name: 'id',
					isArray: false,
					type: 'ID',
					isRequired: true,
					attributes: [],
				},
				forumID: {
					name: 'forumID',
					isArray: false,
					type: 'ID',
					isRequired: true,
					attributes: [],
				},
				editorID: {
					name: 'editorID',
					isArray: false,
					type: 'ID',
					isRequired: true,
					attributes: [],
				},
				editor: {
					name: 'editor',
					isArray: false,
					type: {
						model: 'Editor',
					},
					isRequired: false,
					attributes: [],
					association: {
						connectionType: 'BELONGS_TO',
						targetNames: ['editorID'],
					},
				},
				forum: {
					name: 'forum',
					isArray: false,
					type: {
						model: 'Forum',
					},
					isRequired: false,
					attributes: [],
					association: {
						connectionType: 'BELONGS_TO',
						targetNames: ['forumID'],
					},
				},
			},
		},
		BlogOwner: {
			syncable: true,
			name: 'BlogOwner',
			pluralName: 'BlogOwners',
			attributes: [
				{
					type: 'model',
					properties: {},
				},
			],
			fields: {
				name: {
					name: 'name',
					isArray: false,
					type: 'String',
					isRequired: true,
					attributes: [],
				},
				id: {
					name: 'id',
					isArray: false,
					type: 'ID',
					isRequired: true,
					attributes: [],
				},
				blog: {
					name: 'blog',
					isArray: false,
					type: {
						model: 'Blog',
					},
					isRequired: false,
					attributes: [],
					association: {
						connectionType: 'HAS_ONE',
						associatedWith: ['owner'],
					},
				},
			},
		},
		Person: {
			syncable: true,
			name: 'Person',
			pluralName: 'Persons',
			attributes: [
				{
					type: 'model',
					properties: {},
				},
			],
			fields: {
				id: {
					name: 'id',
					isArray: false,
					type: 'ID',
					isRequired: true,
					attributes: [],
				},
				firstName: {
					name: 'firstName',
					isArray: false,
					type: 'String',
					isRequired: true,
					attributes: [],
				},
				lastName: {
					name: 'lastName',
					isArray: false,
					type: 'String',
					isRequired: true,
					attributes: [],
				},
				username: {
					name: 'username',
					isArray: false,
					type: 'String',
					isRequired: false,
					attributes: [],
				},
				age: {
					name: 'age',
					isArray: false,
					type: 'Int',
					isRequired: false,
					attributes: [],
				},
			},
		},
		Team: {
			syncable: true,
			name: 'Team',
			pluralName: 'Teams',
			attributes: [
				{
					type: 'model',
					properties: {},
				},
			],
			fields: {
				id: {
					name: 'id',
					isArray: false,
					type: 'ID',
					isRequired: true,
					attributes: [],
				},
				name: {
					name: 'name',
					isArray: false,
					type: 'String',
					isRequired: true,
					attributes: [],
				},
			},
		},
		Project: {
			syncable: true,
			name: 'Project',
			pluralName: 'Projects',
			attributes: [
				{
					type: 'model',
					properties: {},
				},
			],
			fields: {
				name: {
					name: 'name',
					isArray: false,
					type: 'String',
					isRequired: true,
					attributes: [],
				},
				id: {
					name: 'id',
					isArray: false,
					type: 'ID',
					isRequired: true,
					attributes: [],
				},
				teamID: {
					name: 'teamID',
					isArray: false,
					type: 'ID',
					isRequired: false,
					attributes: [],
				},
				team: {
					name: 'team',
					isArray: false,
					type: {
						model: 'Team',
					},
					isRequired: false,
					attributes: [],
					association: {
						connectionType: 'HAS_ONE',
						associatedWith: ['id'],
						targetNames: ['teamID'],
					},
				},
			},
		},
	},
	enums: {},
	nonModels: {
		PostMetadata: {
			name: 'PostMetadata',
			fields: {
				rating: {
					name: 'rating',
					isArray: false,
					type: 'Int',
					isRequired: true,
					attributes: [],
				},
				tags: {
					name: 'tags',
					isArray: true,
					type: 'String',
					isRequired: false,
					attributes: [],
				},
				nested: {
					name: 'nested',
					isArray: false,
					type: {
						nonModel: 'Nested',
					},
					isRequired: true,
					attributes: [],
				},
			},
		},
		Nested: {
			name: 'Nested',
			fields: {
				aField: {
					name: 'aField',
					isArray: false,
					type: 'String',
					isRequired: true,
					attributes: [],
				},
			},
		},
	},
	version: 'a66372d29356c40e7cd29e41527cead7',
	codegenVersion: '3.2.0',
};

export const implicitOwnerSchema = {
	models: {
		Post: {
			name: 'Post',
			fields: {
				id: {
					name: 'id',
					isArray: false,
					type: 'ID',
					isRequired: true,
					attributes: [],
				},
				title: {
					name: 'title',
					isArray: false,
					type: 'String',
					isRequired: true,
					attributes: [],
				},
			},
			syncable: true,
			pluralName: 'Posts',
			attributes: [
				{
					type: 'model',
					properties: {},
				},
				{
					type: 'auth',
					properties: {
						rules: [
							{
								provider: 'userPools',
								ownerField: 'owner',
								allow: 'owner',
								identityClaim: 'cognito:username',
								operations: ['create', 'update', 'delete', 'read'],
							},
						],
					},
				},
			],
		},
	},
	enums: {},
	nonModels: {},
	version: '0e29e95012de2d43cf8329d731a5cfb2',
	codegenVersion: '3.2.0',
};

export const explicitOwnerSchema = {
	models: {
		Post: {
			name: 'Post',
			fields: {
				id: {
					name: 'id',
					isArray: false,
					type: 'ID',
					isRequired: true,
					attributes: [],
				},
				title: {
					name: 'title',
					isArray: false,
					type: 'String',
					isRequired: true,
					attributes: [],
				},
				owner: {
					name: 'owner',
					isArray: false,
					type: 'String',
					isRequired: false,
					attributes: [],
				},
			},
			syncable: true,
			pluralName: 'Posts',
			attributes: [
				{
					type: 'model',
					properties: {},
				},
				{
					type: 'auth',
					properties: {
						rules: [
							{
								provider: 'userPools',
								ownerField: 'owner',
								allow: 'owner',
								identityClaim: 'cognito:username',
								operations: ['create', 'update', 'delete', 'read'],
							},
						],
					},
				},
			],
		},
	},
	enums: {},
	nonModels: {},
	version: '0e29e95012de2d43cf8329d731a5cfb2',
	codegenVersion: '3.2.0',
};

export const groupSchema = {
	models: {
		Post: {
			name: 'Post',
			fields: {
				id: {
					name: 'id',
					isArray: false,
					type: 'ID',
					isRequired: true,
					attributes: [],
				},
				title: {
					name: 'title',
					isArray: false,
					type: 'String',
					isRequired: true,
					attributes: [],
				},
			},
			syncable: true,
			pluralName: 'Posts',
			attributes: [
				{
					type: 'model',
					properties: {},
				},
				{
					type: 'auth',
					properties: {
						rules: [
							{
								groupClaim: 'cognito:groups',
								provider: 'userPools',
								allow: 'groups',
								groups: ['Admin'],
								operations: ['create', 'update', 'delete', 'read'],
							},
						],
					},
				},
			],
		},
	},
	enums: {},
	nonModels: {},
	version: '0e29e95012de2d43cf8329d731a5cfb2',
	codegenVersion: '3.2.0',
};
