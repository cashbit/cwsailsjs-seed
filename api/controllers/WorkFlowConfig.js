{
		"newproject":{
			"title":"New project",
			"description": "This step are useful when you want to create a new project.",
			"steps":[
				{
					"title":"Check Global company",
					"description":"Verify if the end user is part of a global company and if the global company is already registered, otherwise add a new Global company before proceeding.",
					"url": "/globalcompany"
				},
				{
					"title":"Check End user",
					"description":"Verify if the end user is already registered in the customer list, otherwise add a new End user before proceeding.",
					"url": "/customer"
				},
				{
					"title":"Check PMC",
					"description":"Verify if the PMC is already registered in the customer list, otherwise add a new PMC as a new customer before proceeding.",
					"url": "/customer"
				},
				{
					"title":"Check contacts",
					"description":"Verify all contacts involved in this project: search for existent, update/refresh informations, create new contacts, connect contact to companies, competitors as key people",
					"url": "/contact"
				},
				{
					"title":"Check existing projects",
					"description":"Check if project exists or create a new project",
					"url": "/project"
				}
			],
			"finalUrl": "/project"
		},
		"newbidder":{
			"title":"New bidder",
			"description": "This step are useful when you want to create a new bidder in an existing project.",
			"steps":[
				{
					"title":"Check Customer - bidder",
					"description":"Verify all bidder involved in this project: search for existent, update/refresh informations, create new customer.",
					"url": "/customer"
				},
				{
					"title":"Check Licensor",
					"description":"Verify all licensor involved in this project: search for existent, update/refresh informations, create new licensor.",
					"url": "/customer"
				},
				{
					"title":"Select project",
					"description":"Search existing project filling the search fields, then select the project",
					"url": "/project"
				},
				{
					"pathname": "/project/show",
					"title":"Create bidder",
					"description":"Add the bidder to this project by clicking 'ADD' in the bidder section"
				}
			],
			"finalUrl": "/project"
		},
		"newproposal":{
			"title": "New proposal on existing project",
			"description": "Select this if you want to add a new proposal on an existing project",
			"steps":[
				{
					"pathname": "/project",
					"title":"Search the project",
					"description":"Search existing project filling the search fields, then select the project",
					"url": "/project"
				},
				{
					"pathname": "/project/show",
					"title":"Select the bidder",
					"description":"Select the existing bidder in this project or add a new bidder"
				},
				{
					"pathname": "/projectbidder/show",
					"title":"Add the new proposal",
					"description":"Go to the proposal section and click 'ADD'"
				}
			],
			"finalUrl": "/project"
		},
		"proposalcompare":{
			"title": "Compare proposals with hold points",
			"description": "Select this if you want to analyze and compare actual proposals by hold point ranking",
			"steps":[
				{
					"pathname": "/proposalsearch/indexall",
					"title":"Compare proposals",
					"description":"Select proposals to compare by filtering with drop-down menus. Proposals are coloured in Red if ranking in under 0.5, yellow if under 0.8 and green if equal 1.0",
					"url": "/proposalsearch/indexall"
				}
			],
			"finalUrl": "/proposalsearch/indexall"
		},
		"overdueproposals":{
			"title": "Check for overdue proposals",
			"description": "Select this if you want to check proposals not yet in \"Budget proposal\" or \"Go&Sale\" and with issue date past by 4 weeks",
			"steps":[
				{
					"pathname": "/overdueproposal",
					"title":"Check over due proposals",
					"description":"You can filter by user to know each overdue proposal for each user",
					"url": "/overdueproposal/checkOverdueProposals"
				}
			],
			"finalUrl": "/overdueproposal"
		},
		"marketingevent":{
			"title": "Create or manage existing marketing events",
			"description": "Select this if you want to manage data related to marketing event such as customer meeting, fair, workshop and so on.",
			"steps":[
				{
					"pathname": "/marketingevent",
					"title":"Manage marketing event",
					"description":"Search or crate a new marketing event. For each event you can add one or more survery report.",
					"url": "/marketingevent"
				}
			],
			"finalUrl": "/marketingevent"
		}

	}