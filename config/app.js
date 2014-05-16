module.exports = {

	// default Application name
    appName : "SETTHEAPPNAMEINCONFIG",

    // configured locales
    locale: {
		it: {
			dateFormat : "d/m/y"
		},
		en: {
			dateFormat : "m/d/y"
		}
    },

    // user groups and specific application name, home page, navigation bar menu
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
		},
		guest : {
			appName: "GUEST APP NAME",
			home: "",
			navmenu: [
				{
					title: "ControllerTitle",
					controller: "ControllerName"
				}
			]
		}
    },

    // Search engine configuration. Each object defines the field and the entity where the search engine will search for the given string.
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

	// Configuration for the TablesController
	menuConfig: {
		admin :{
			maxItems: 10,
			sortAttribute: "updatedAt",
			menuEntities: [
				["user"]
			]
		}
	},

	// at first startup, if the user model is empty, this values will be created in each model-entity, feel free to add record for every model you create.
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