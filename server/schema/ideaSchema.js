const ideaSchema = {
	"type": "object",
	"required": ["name", "title", "description"],
	"properties": {
		"id": {
			"type": "string",
			"minLength": 1
		},
		"name": {
			"type": "string",
			"minLength": 2
		},
        "description": {
			"type": "string",
			"minLength": 2
		},
        "numWeeks": {
            "type": number,
        },
		"weeklyRevenue": {
            "type": number,
        }
	}
}

module.exports = ideaSchema;
