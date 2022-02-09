const minionsSchema = {
	"type": "object",
	"required": ["name", "title", "salary"],
	"properties": {
		"id": {
			"type": "string",
			"minLength": 1
		},
		"name": {
			"type": "string",
			"minLength": 2
		},
        "title": {
			"type": "string",
			"minLength": 2
		},
        "salary": {
            "type": "number",
        },
        "weaknesses": {
            "type": "string",
        }
	}
}

module.exports = minionsSchema;
