const meetingSchema = {
	"type": "object",
	"required": ["time", "date", "day", "note"],
	"properties": {
		"name": {
			"time": "string",
			"minLength": 2
		},
        "date": {
			"type": "string",
            "format": "date"
		},
        "day": {
            "type": string,
        },
		"note": {
            "type": string,
        }
	}
}

module.exports = meetingSchema;
