const meetingSchema = {
  type: 'object',
  required: ['time', 'date', 'day', 'note'],
  properties: {
    time: {
      time: 'string',
      minLength: 5,
      maxLength: 5,
    },
    date: {
      type: 'string',
      format: 'date-time',
    },
    day: {
      type: 'string',
    },
    note: {
      type: 'string',
    },
  },
};

module.exports = meetingSchema;
