const { expect } = require('chai');
const request = require('supertest');

const app = require('../server');

describe('/api/minions routes', () => {
  const fakeDb = require('../server/db.js');

  describe('GET /api/minions', () => {
    it('returns an array', () =>
      request(app)
        .get('/api/minions')
        .expect(200)
        .then((response) => {
          expect(response.body).to.be.an.instanceOf(Array);
        }));

    it('returns an array of all minions', () =>
      request(app)
        .get('/api/minions')
        .expect(200)
        .then((response) => {
          const { length } = fakeDb.getAllFromDatabase('minions');
          expect(response.body.length).to.be.equal(length);
          response.body.forEach((minion) => {
            expect(minion).to.have.ownProperty('id');
            expect(minion).to.have.ownProperty('name');
            expect(minion).to.have.ownProperty('title');
            expect(minion).to.have.ownProperty('weaknesses');
            expect(minion).to.have.ownProperty('salary');
          });
        }));
  });

  describe('GET /minions/:minionId', () => {
    it('returns a single minion object', () =>
      request(app)
        .get(`/api/minions/1`)
        .expect(200)
        .then((response) => {
          const minion = response.body;
          expect(minion).to.be.an.instanceOf(Object);
          expect(minion).to.not.be.an.instanceOf(Array);
        }));

    it('returns a full minion object', () =>
      request(app)
        .get(`/api/minions/1`)
        .expect(200)
        .then((response) => {
          const minion = response.body;
          expect(minion).to.have.ownProperty('id');
          expect(minion).to.have.ownProperty('name');
          expect(minion).to.have.ownProperty('title');
          expect(minion).to.have.ownProperty('weaknesses');
          expect(minion).to.have.ownProperty('salary');
        }));

    it('returned minion has the correct id', () =>
      request(app)
        .get(`/api/minions/1`)
        .expect(200)
        .then((response) => {
          const minion = response.body;
          expect(minion.id).to.be.an.equal('1');
        }));

    it('called with a non-numeric ID returns a 404 error', () =>
      request(app).get('/api/minions/notAnId').expect(404));

    it('called with an invalid ID returns a 404 error', () =>
      request(app).get('/api/minions/450').expect(404));
  });

  describe('PUT /api/minions/:minionId', () => {
    it('updates the correct minion and returns it', () => {
      let initialMinion;
      let updatedMinionInfo;
      return request(app)
        .get('/api/minions/1')
        .then((response) => {
          initialMinion = response.body;
        })
        .then(() => {
          updatedMinionInfo = { ...initialMinion, name: 'Test' };
          return request(app).put('/api/minions/1').send(updatedMinionInfo);
        })
        .then((response) => {
          expect(response.body).to.be.deep.equal(updatedMinionInfo);
        });
    });

    it('updates the correct minion and persists to the database', () => {
      let initialMinion;
      let updatedMinionInfo;
      return request(app)
        .get('/api/minions/1')
        .then((response) => {
          initialMinion = response.body;
        })
        .then(() => {
          updatedMinionInfo = { ...initialMinion, name: 'Persistence Test' };
          return request(app).put('/api/minions/1').send(updatedMinionInfo);
        })
        .then(() => request(app).get('/api/minions/1'))
        .then((response) => response.body)
        .then((minionFromDatabase) => {
          expect(minionFromDatabase.name).to.equal('Persistence Test');
        });
    });

    it('called with a non-numeric ID returns a 404 error', () =>
      request(app).put('/api/minions/notAnId').expect(404));

    it('called with an invalid ID returns a 404 error', () =>
      request(app).put('/api/minions/450').expect(404));

    it('called with an invalid ID does not change the database array', () => {
      let initialMinionsArray;
      return request(app)
        .get('/api/minions')
        .then((response) => {
          initialMinionsArray = response.body;
        })
        .then(() =>
          request(app).put('/api/minions/notAnId').send({ key: 'value' }),
        )
        .then(() => request(app).get('/api/minions'))
        .then((afterPutResponse) => {
          const postRequestMinionsArray = afterPutResponse.body;
          expect(initialMinionsArray).to.be.deep.equal(postRequestMinionsArray);
        });
    });
  });

  describe('POST /api/minions', () => {
    it('should add a new minion if all supplied information is correct', () => {
      let initialMinionsArray;
      const newMinionObject = {
        name: 'Test',
        title: 'dr',
        salary: 0,
        weaknesses: '',
      };
      return request(app)
        .get('/api/minions')
        .then((response) => {
          initialMinionsArray = response.body;
        })
        .then(() =>
          request(app).post('/api/minions').send(newMinionObject).expect(201),
        )
        .then((response) => response.body)
        .then((createdMinion) => {
          newMinionObject.id = createdMinion.id;
          expect(newMinionObject).to.be.deep.equal(createdMinion);
        });
    });
  });

  describe('DELETE /api/minions', () => {
    it('deletes the correct minion by id', () => {
      let initialMinionsArray;
      return request(app)
        .get('/api/minions')
        .then((response) => {
          initialMinionsArray = response.body;
        })
        .then(() => request(app).delete('/api/minions/1').expect(204))
        .then(() => request(app).get('/api/minions'))
        .then((response) => response.body)
        .then((afterDeleteMinionsArray) => {
          expect(afterDeleteMinionsArray).to.not.be.deep.equal(
            initialMinionsArray,
          );
          const shouldBeDeletedMinion = afterDeleteMinionsArray.find(
            (el) => el.id === '1',
          );
          expect(shouldBeDeletedMinion).to.be.undefined;
        });
    });

    it('called with a non-numeric ID returns a 404 error', () =>
      request(app).delete('/api/minions/notAnId').expect(404));

    it('called with an invalid ID returns a 404 error', () =>
      request(app).delete('/api/minions/450').expect(404));
  });
});

describe('/api/ideas routes', () => {
  const fakeDb = require('../server/db.js');

  describe('GET /api/ideas', () => {
    it('returns an array', () =>
      request(app)
        .get('/api/ideas')
        .expect(200)
        .then((response) => {
          expect(response.body).to.be.an.instanceOf(Array);
        }));

    it('returns an array of all ideas', () =>
      request(app)
        .get('/api/ideas')
        .expect(200)
        .then((response) => {
          const { length } = fakeDb.getAllFromDatabase('ideas');
          expect(response.body.length).to.be.equal(length);
          response.body.forEach((idea) => {
            expect(idea).to.have.ownProperty('id');
            expect(idea).to.have.ownProperty('name');
            expect(idea).to.have.ownProperty('description');
            expect(idea).to.have.ownProperty('weeklyRevenue');
            expect(idea).to.have.ownProperty('numWeeks');
          });
        }));
  });

  describe('GET /ideas/:ideaId', () => {
    it('returns a single idea object', () => {
      request(app)
        .get(`/api/ideas/1`)
        .expect(200)
        .then((response) => response.body)
        .then((idea) => {
          expect(idea).to.be.an.instanceOf(Object);
          expect(idea).to.not.be.an.instanceOf(Array);
        });
    });

    it('returns a full idea object with correct properties', () => {
      request(app)
        .get(`/api/ideas/1`)
        .expect(200)
        .then((response) => response.body)
        .then((idea) => {
          expect(idea).to.have.ownProperty('id');
          expect(idea).to.have.ownProperty('name');
          expect(idea).to.have.ownProperty('description');
          expect(idea).to.have.ownProperty('weeklyRevenue');
          expect(idea).to.have.ownProperty('numWeeks');
        });
    });

    it('returned idea has the correct id', () => {
      request(app)
        .get(`/api/ideas/1`)
        .expect(200)
        .then((response) => response.body)
        .then((idea) => {
          expect(idea.id).to.equal('1');
        });
    });

    it('called with a non-numeric ID returns a 404 error', () =>
      request(app).get('/api/ideas/notAnId').expect(404));

    it('called with an invalid ID returns a 404 error', () =>
      request(app).get('/api/ideas/450').expect(404));
  });

  describe('PUT /api/ideas/:ideaId', () => {
    it('updates the correct idea and returns it', () => {
      let initialIdea;
      let updatedIdeaInfo;
      request(app)
        .get('/api/ideas/1')
        .then((response) => {
          initialIdea = response.body;
        })
        .then(() => {
          updatedIdeaInfo = { ...initialIdea, name: 'Test' };
          return request(app).put('/api/ideas/1').send(updatedIdeaInfo);
        })
        .then((response) => {
          expect(response.body).to.be.deep.equal(updatedIdeaInfo);
        });
    });

    it('updates the correct idea and persists to the database', () => {
      let initialIdea;
      let updatedIdeaInfo;
      request(app)
        .get('/api/ideas/1')
        .then((response) => {
          initialIdea = response.body;
        })
        .then(() => {
          updatedIdeaInfo = { ...initialIdea, name: 'Persistence Test' };
          return request(app).put('/api/ideas/1').send(updatedIdeaInfo);
        })
        .then(() => request(app).get('/api/ideas/1'))
        .then((response) => response.body)
        .then((ideaFromDatabase) => {
          expect(ideaFromDatabase.name).to.equal('Persistence Test');
        });
    });

    it('called with a non-numeric ID returns a 404 error', () =>
      request(app).put('/api/ideas/notAnId').expect(404));

    it('called with an invalid ID returns a 404 error', () =>
      request(app).put('/api/ideas/450').expect(404));

    it('called with an invalid ID does not change the database array', () => {
      let initialIdeasArray;
      return request(app)
        .get('/api/ideas')
        .then((response) => {
          initialIdeasArray = response.body;
        })
        .then(() =>
          request(app).put('/api/ideas/notAnId').send({ key: 'value' }),
        )
        .then(() => request(app).get('/api/ideas'))
        .then((response) => response.body)
        .then((postRequestIdeasArray) => {
          expect(initialIdeasArray).to.be.deep.equal(postRequestIdeasArray);
        });
    });
  });

  describe('POST /api/ideas', () => {
    it('should add a new idea if all supplied information is correct', () => {
      let initialIdeasArray;
      const newIdeaObject = {
        name: 'Test',
        description: 'desc',
        weeklyRevenue: 200000,
        numWeeks: 10,
      };
      return request(app)
        .get('/api/ideas')
        .then((response) => {
          initialIdeasArray = response.body;
        })
        .then(() =>
          request(app).post('/api/ideas').send(newIdeaObject).expect(201),
        )
        .then((response) => response.body)
        .then((createdIdea) => {
          newIdeaObject.id = createdIdea.id;
          expect(newIdeaObject).to.be.deep.equal(createdIdea);
        });
    });
  });

  describe('DELETE /api/ideas', () => {
    it('deletes the correct minion by id', () => {
      let initialIdeasArray;
      request(app)
        .get('/api/ideas')
        .then((response) => {
          initialIdeasArray = response.body;
        })
        .then(() => request(app).delete('/api/ideas/1').expect(204))
        .then(() => request(app).get('/api/ideas'))
        .then((response) => response.body)
        .then((afterDeleteIdeasArray) => {
          expect(afterDeleteIdeasArray).to.not.be.deep.equal(initialIdeasArray);
          const shouldBeDeletedIdea = afterDeleteIdeasArray.find(
            (el) => el.id === '1',
          );
          expect(shouldBeDeletedIdea).to.be.undefined;
        });
    });

    it('called with a non-numeric ID returns a 404 error', () =>
      request(app).delete('/api/ideas/notAnId').expect(404));

    it('called with an invalid ID returns a 404 error', () =>
      request(app).delete('/api/ideas/450').expect(404));
  });
});

describe('checkMillionDollarIdea middleware', () => {
  const checkMillionDollarIdea = require('../server/checkMillionDollarIdea');

  let req;
  let response;
  let status;
  let sent;
  let nextCallback;
  let nextCalled;

  beforeEach(() => {
    status = null;
    sent = null;
    req = {
      body: {},
    };
    response = {
      send(...args) {
        sent = args;
      },
      status(statusCode) {
        status = statusCode;
        return this;
      },
      // Codecademy doesn't teach this method but it is in the Express docs.
      sendStatus(status) {
        this.status(status).send();
      },
    };
    nextCalled = false;
    nextCallback = () => {
      nextCalled = true;
    };
  });

  it('is a function takes three arguments', () => {
    expect(checkMillionDollarIdea).to.be.an.instanceOf(Function);
    expect(checkMillionDollarIdea.length).to.equal(3);
  });

  it('sends a 400 error if the total yield is less than one million dollars', () => {
    request(app)
      .post('/api/ideas')
      .send({
        name: 'Test',
        description: 'Test',
        numWeeks: '2',
        weeklyRevenue: '3',
      })
      .expect(400);
  });

  it('calls next for ideas that will yield at least one million dollars', () => {
    req.body.numWeeks = '1000000';
    req.body.weeklyRevenue = '1';
    checkMillionDollarIdea(req, response, nextCallback);
    expect(status).to.equal(null);
    expect(nextCalled).to.be.true;
  });

  it('sends a 400 error if numWeeks or weeklyRevenue is not supplied', () => {
    request(app)
      .post('/api/ideas')
      .send({
        name: 'Test',
        description: 'Test',
      })
      .expect(400);
  });

  it('sends a 400 error if numWeeks or weeklyRevenue is an invalid string', () => {
    request(app)
      .post('/api/ideas')
      .send({
        name: 'Test',
        description: 'Test',
        numWeeks: 'invalid',
        weeklyRevenue: '3',
      })
      .expect(400);
  });

  it('is used in a POST /api/ideas route to reject insufficiently profitable ideas', () =>
    request(app)
      .post('/api/ideas')
      .send({
        name: 'Test',
        description: 'Test',
        numWeeks: 4,
        weeklyRevenue: 4,
      })
      .expect(400));
});

describe('/api/meetings routes', () => {
  const fakeDb = require('../server/db.js');

  describe('GET /api/meetings', () => {
    it('returns an array', () =>
      request(app)
        .get('/api/meetings')
        .expect(200)
        .then((response) => {
          expect(response.body).to.be.an.instanceOf(Array);
        }));

    it('returns an array of all meetings', () =>
      request(app)
        .get('/api/meetings')
        .expect(200)
        .then((response) => {
          const { length } = fakeDb.getAllFromDatabase('meetings');
          expect(response.body.length).to.be.equal(length);
          response.body.forEach((minion) => {
            expect(minion).to.have.ownProperty('time');
            expect(minion).to.have.ownProperty('date');
            expect(minion).to.have.ownProperty('day');
            expect(minion).to.have.ownProperty('note');
          });
        }));
  });

  describe('POST /api/meetings', () => {
    it('should create a new meetings and return it', () => {
      const newMeetingObject = {
        time: '15:10',
        date: new Date(),
        day: 'Sunday',
        note: 'note',
      };
      request(app)
        .post('/api/meetings')
        .send(newMeetingObject)
        .expect(201)
        .then((response) => response.body)
        .then((createdMeeting) => {
          expect(createdMeeting).to.have.ownProperty('time');
          expect(createdMeeting).to.have.ownProperty('date');
          expect(createdMeeting).to.have.ownProperty('day');
          expect(createdMeeting).to.have.ownProperty('note');
        });
    });

    it('should persist the created meeting to the database', () => {
      const newMeetingObject = {
        time: '15:10',
        date: new Date(),
        day: 'Sunday',
        note: 'note',
      };
      let initialMeetingsArray;
      let newlyCreatedMeeting;
      return request(app)
        .get('/api/meetings')
        .then((response) => {
          initialMeetingsArray = response.body;
        })
        .then(() =>
          request(app).post('/api/meetings').send(newMeetingObject).expect(201),
        )
        .then((response) => response.body)
        .then((createdMeeting) => {
          newlyCreatedMeeting = createdMeeting;
          return request(app).get('/api/meetings');
        })
        .then((response) => response.body)
        .then((newMeetingsArray) => {
          expect(newMeetingsArray.length).to.equal(
            initialMeetingsArray.length + 1,
          );
          const createdMeetingFound = newMeetingsArray.some(
            (meeting) => meeting.id === newlyCreatedMeeting.id,
          );
          expect(createdMeetingFound).to.be.true;
        });
    });
  });

  describe('DELETE /api/meetings route', () => {
    it('deletes all meetings', () => {
      let initialMeetingsArray;
      return request(app)
        .get('/api/meetings')
        .then((response) => {
          initialMeetingsArray = response.body;
        })
        .then(() => request(app).delete('/api/meetings').expect(204))
        .then(() => request(app).get('/api/meetings'))
        .then((response) => response.body)
        .then((afterDeleteIdeasArray) => {
          expect(afterDeleteIdeasArray).to.be.an.instanceOf(Array);
          expect(afterDeleteIdeasArray).to.have.property('length', 0);
        });
    });
  });
});

describe('BONUS: /api/minions/:minionId/work routes', () => {
  const fakeDb = require('../server/db.js').db;

  describe('GET /api/minions/:minionId/work', () => {
    it('returns an array', () =>
      request(app)
        .get('/api/minions/2/work')
        .expect(200)
        .then((response) => {
          expect(response.body).to.be.an.instanceOf(Array);
        }));

    it('returns an array of all all work for the specified minion', () =>
      request(app)
        .get('/api/minions/2/work')
        .then((response) => response.body)
        .then((minionTwoWork) => {
          minionTwoWork.forEach((work) => {
            expect(work).to.have.property('minionId', '2');
          });
        }));

    it('called with a non-numeric minion ID returns a 404 error', () =>
      request(app).get('/api/minions/notAnId/work').expect(404));

    it('called with an invalid ID minion returns a 404 error', () =>
      request(app).get('/api/minions/450/work').expect(404));
  });

  describe('PUT /api/minions/:minionId/work/:workId', () => {
    it('updates the correct work and returns it', () => {
      let initialWork;
      let updatedWorkInfo;
      return request(app)
        .get('/api/minions/2/work')
        .then((response) => response.body)
        .then((workArray) => {
          initialWork = workArray[0];
        })
        .then(() => {
          updatedWorkInfo = { ...initialWork, hours: 45 };
          return request(app)
            .put(`/api/minions/2/work/${initialWork.id}`)
            .send(updatedWorkInfo);
        })
        .then((response) => {
          expect(response.body).to.be.deep.equal(updatedWorkInfo);
        });
    });

    it('updates the correct work item and persists to the database', () => {
      let initialWork;
      let updatedWorkInfo;
      return request(app)
        .get('/api/minions/2/work')
        .then((response) => response.body)
        .then((workArray) => {
          initialWork = workArray[0];
        })
        .then(() => {
          updatedWorkInfo = { ...initialWork, title: 'Persistence Test' };
          return request(app)
            .put(`/api/minions/2/work/${initialWork.id}`)
            .send(updatedWorkInfo);
        })
        .then(() => request(app).get(`/api/minions/2/work`))
        .then((response) => response.body)
        .then((postUpdateWorkArray) => {
          const updatedWorkObject = postUpdateWorkArray.find(
            (work) => work.id === initialWork.id,
          );
          expect(updatedWorkObject).to.have.property(
            'title',
            'Persistence Test',
          );
        });
    });

    it('called with a non-numeric minion ID returns a 404 error', () =>
      request(app).put('/api/minions/notAnId').expect(404));

    it('called with an invalid minion ID returns a 404 error', () =>
      request(app).put('/api/minions/450').expect(404));

    it('called with a non-numeric work ID returns a 404 error', () =>
      request(app).put('/api/minions/notAnId/work/notAnId').expect(404));

    it('called with an invalid work ID returns a 404 error', () =>
      request(app).put('/api/minions/450/work/450').expect(404));

    it('called with an invalid ID does not change the database array', () => {
      let initialMinionsWorkArray;
      return request(app)
        .get('/api/minions/2/work')
        .then((response) => {
          initialMinionsWorkArray = response.body;
        })
        .then(() =>
          request(app)
            .put('/api/minions/2/work/notAnId')
            .send({ key: 'value' }),
        )
        .then(() => request(app).get('/api/minions/2/work'))
        .then((response) => response.body)
        .then((postRequestWorkArray) => {
          expect(initialMinionsWorkArray).to.be.deep.equal(
            postRequestWorkArray,
          );
        });
    });

    it('returns a 400 if a work ID with the wrong :minionId is requested', () => {
      let initialWork;
      let updatedWorkInfo;
      return request(app)
        .get('/api/minions/2/work')
        .then((response) => response.body)
        .then((workArray) => {
          initialWork = workArray[0];
        })
        .then(() => {
          updatedWorkInfo = { ...initialWork, minionId: 45 };
          return request(app)
            .put('/api/minions/2/work/1')
            .send(updatedWorkInfo)
            .expect(400);
        });
    });
  });

  describe('POST /api/minions/:minionId/work', () => {
    it('should add a new work item if all supplied information is correct', () => {
      const newWorkObject = {
        title: 'Test',
        description: '',
        hours: 20,
        minionId: '2',
      };
      return request(app)
        .post('/api/minions/2/work')
        .send(newWorkObject)
        .expect(201)
        .then((res) => res.body)
        .then((createdWork) => {
          newWorkObject.id = createdWork.id;
          expect(newWorkObject).to.be.deep.equal(createdWork);
        });
    });
  });

  describe('DELETE /api/minions/:minionId/work/:workId', () => {
    it('deletes the correct work by id', () => {
      let initialWorkArray;
      return request(app)
        .get('/api/minions/2/work')
        .then((response) => {
          initialWorkArray = response.body;
        })
        .then(() => request(app).delete('/api/minions/2/work/2').expect(204))
        .then(() => request(app).get('/api/minions/2/work'))
        .then((response) => response.body)
        .then((afterDeleteWorkArray) => {
          expect(afterDeleteWorkArray).to.not.be.deep.equal(initialWorkArray);
          const shouldBeDeletedWork = afterDeleteWorkArray.find(
            (el) => el.id === '2',
          );
          expect(shouldBeDeletedWork).to.be.undefined;
        });
    });

    it('called with a non-numeric minion ID returns a 404 error', () =>
      request(app).delete('/api/minions/notAnId').expect(404));

    it('called with an invalid minion ID returns a 404 error', () =>
      request(app).delete('/api/minions/450').expect(404));

    it('called with a non-numeric work ID returns a 404 error', () =>
      request(app).delete('/api/minions/notAnId/work/notAnId').expect(404));

    it('called with an invalid work ID returns a 404 error', () =>
      request(app).delete('/api/minions/450/work/450').expect(404));
  });
});
