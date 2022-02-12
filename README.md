# Boss Machine

## Project Overview

In this project, you will create an entire API to serve information to a Boss Machine, a unique management application for today's most accomplished (evil) entrepreneurs. You will create routes to manage your 'minions', your brilliant 'million dollar ideas', and to handle all the annoying meetings that keep getting added to your busy schedule.

The project was done to complete a codecademy course and started from the boilerplate template (frontend, fake db).

The main goal was to train and master [express.js](https://www.npmjs.com/package/express). In order to take full advantage of this exercise, I have broadened the scope of the exercise. 

## Implementation Details

Directory tree (I omited not created by me):

├── package.json

├── README.md

├── server

│   ├── api

│   │   ├── api.js

│   │   ├── ideasApi.js

│   │   ├── meetingsApi.js

│   │   ├── middlewareUtils.js

│   │   ├── minionsApi.js

│   │   └── workApi.js

│   ├── checkMillionDollarIdea.js

│   ├── ErrorHandling.js

│   └── schema

│       ├── ideasSchema.js

│       ├── meetingSchema.js

│       └── minionsSchema.js

├── server.js

├── .husky

├── .prettierrc

├── .eslintrc.js


#### Routes Required

- `/api/minions`
  - GET /api/minions to get an array of all minions.
  - POST /api/minions to create a new minion and save it to the database.
  - GET /api/minions/:minionId to get a single minion by id.
  - PUT /api/minions/:minionId to update a single minion by id.
  - DELETE /api/minions/:minionId to delete a single minion by id.
- `/api/ideas`
  - GET /api/ideas to get an array of all ideas.
  - POST /api/ideas to create a new idea and save it to the database.
  - GET /api/ideas/:ideaId to get a single idea by id.
  - PUT /api/ideas/:ideaId to update a single idea by id.
  - DELETE /api/ideas/:ideaId to delete a single idea by id.
- `/api/meetings`
  - GET /api/meetings to get an array of all meetings.
  - POST /api/meetings to create a new meeting and save it to the database.
  - DELETE /api/meetings to delete _all_ meetings from the database.

For all `/api/minions` and `/api/ideas routes`, any POST or PUT requests will send their new/updated resources in the request body. POST request bodies will not have an `id` property, you will have to set it based on the next id in sequence.

For `/api/meetings` POST route, no request body is necessary, as meetings are generated automatically by the server upon request. Use the provided `createMeeting` function exported from **db.js** to create a new meeting object.

#### Schemas

- Minion:
  - id: string
  - name: string
  - title: string
  - salary: number
- Idea
  - id: string
  - name: string
  - description: string
  - numWeeks: number
  - weeklyRevenue: number
- Meeting
  - time: string
  - date: JS `Date` object
  - day: string
  - note: string

Take note that many values that could be numbers are in fact strings. Since we are writing an API, we can't trust that data is always provided by a client. You may need to transform between String and Number JavaScript types in order to provide full functionality in your API.

### Custom Middleware

- You will create a custom middleware function `checkMillionDollarIdea` that will come in handy in some /api/ideas routes. Write this function in the **server/checkMillionDollarIdea.js** file. This function will make sure that any new or updated ideas are still worth at least one million dollars! The total value of an idea is the product of its `numWeeks` and `weeklyRevenue` properties.

### Bonus

As a bonus, you may implement routes to allow bosses to add and remove work from their minions' backlogs.

Schema:

- Work:
  - id: string
  - title: string
  - description: string
  - hours: number
  - minionId: string

Routes required:

- GET /api/minions/:minionId/work to get an array of all work for the specified minon.
- POST /api/minions/:minionId/work to create a new work object and save it to the database.
- PUT /api/minions/:minionId/work/:workId to update a single work by id.
- DELETE /api/minions/:minionId/work/:workId to delete a single work by id.
