module.exports = {
    appName : "SETTHEAPPNAMEINCONFIG",

    locale: {
		it: {
			dateFormat : "d/m/y"
		},
		en: {
			dateFormat : "m/d/y"
		}
    },

    userGroups:{
		admin : {
			appName: "ADMINAPPNAME",
			home: "user",
			navmenu: [
				{
					title: "Users",
					controller: "user"
				}
			]
		}
    },

	searchConfig : [
		{
			entity: "user",
			searchField: "email",
			titleField: "email",
			subTitleField: "updatedAt",
			groups: {
				admin: true
			}
		}
	],

	menuConfig: {
		admin :{
			maxItems: 10,
			sortAttribute: "updatedAt",
			menuEntities: [
				["user"]
			]
		}
	},

	defaultValues : {
		user: [
			{
				"name": "guest",
				"title": "mr",
				"email": "guest@guest.it",
				"admin": false,
				"online": false,
				"password": "guest",
				"confirmation": "guest",
				"group": "guest"
			}
		]
	}
};