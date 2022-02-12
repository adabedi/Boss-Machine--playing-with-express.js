const ideasSchema = {
  type: 'object',
  required: ['name', 'description', 'weeklyRevenue', 'numWeeks'],
  properties: {
    id: {
      type: 'string',
      minLength: 1,
    },
    name: {
      type: 'string',
      minLength: 2,
    },
    description: {
      type: 'string',
      minLength: 2,
    },
    numWeeks: {
      type: 'number',
    },
    weeklyRevenue: {
      type: 'number',
    },
  },
};

module.exports = ideasSchema;
