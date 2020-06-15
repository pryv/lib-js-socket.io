/*global 
  Pryv, chai, should, testData, expect, should
*/

//const apiEndpoint = testData.pryvApiEndPoints[0];
const apiEndpoint = 'https://ckbg78dpy0003zu0s2mixxlhy@my-computer.rec.la:4443/perki/';
const apiEndpointBogusUsername = 'https://bogus@my-computer.rec.la:4443/perkix/';
const apiEndpointBogusToken = 'https://bogus@my-computer.rec.la:4443/perki/';
const cuid = require('cuid');


let conn = null; 
const testStreamId = 'socket-test';

describe('SocketIO', function () {
  this.timeout(3000);

  before(async () => {
    conn = new Pryv.Connection(apiEndpoint);
    const res = await conn.api([{
      method: 'streams.create',
      params: {
        id: testStreamId,
        name: testStreamId
      }
    }]);
    expect(res[0]).to.exist;
    if (res[0].stream) return;
    expect(res[0].error).to.exist;
    expect(res[0].error.id).to.equal('item-already-exists');
  });

  describe('init on invalid endpoint', () => { 
    it('Should throw an error "Not Found" when user is not known', async () => {
      conn = new Pryv.Connection(apiEndpointBogusUsername);
      try {
        const res = await conn.socket.open();
      } catch (e) {
        return expect(e.message).to.equals('Not Found');
      }
      throw new Error('Should throw an error');
    });

    it('Should throw an error "Unothorized" when token is invalid', async () => {
      conn = new Pryv.Connection(apiEndpointBogusToken);
      try {
        const res = await conn.socket.open();
      } catch (e) {
        return expect(e.message).to.equals('Cannot find access from token.');
      }
      throw new Error('Should throw an error');
    });

  });

  describe('init on valid endpoint', () => {
    beforeEach(async () => {
      conn = new Pryv.Connection(apiEndpoint);
    });

    afterEach(() => {
      conn = null;
    });

    it('Should throw an error if conn.socket.api() is called before being open()', async() => {
      try { 
        const res = await conn.socket.api([{ method: 'events.get', params: {} }]);
      } catch (e) {
        return expect(e.message).to.equals('Initialize socket.io with connection.socket.open() before');
      } 
      throw new Error('Should throw an error');
    });


    it('Should throw an error if conn.socket.on() is called before being open()', async () => {
      try {
        const res = await conn.socket.on('eventsChanged');
      } catch (e) {
        return expect(e.message).to.equals('Initialize socket.io with connection.socket.open() before');
      }
      throw new Error('Should throw an error');
    });

    it('Correct initialization should return socket instance', async () => {
      const socket = await conn.socket.open();
      expect(socket._io).to.exist;
    });
  });


  describe('socket.api', () => { 
    before(async () => {
      conn = new Pryv.Connection(apiEndpoint);
      await conn.socket.open();
    });

    after(() => {
      conn = null;
    });

    it('Handle correctly batch calls', async () => {
      const res = await conn.socket.api([{method: 'streams.get', params: {}}]);
      expect(res[0]).to.exist;
      expect(res[0].streams).to.exist;
    });

    // we don't test further .api() as it relies on the implementation of Pryv.Connection
  }); 


  describe('notification', () => {
    before(async () => {
      conn = new Pryv.Connection(apiEndpoint);
      await conn.socket.open();
    });

    after(() => {
      conn = null;
    });

    it('Fails on requesting an invalid notifcation', async () => {
      try { 
        conn.socket.on('Bogus', () => {});
      } catch (e) {
        return expect(e.message).to.equals('Unkown event [Bogus]. Allowed events are: eventsChanged,streamsChanged,accessesChanged,disconnect,error');
      }
      throw new Error('Should fail');
    });

    it('Catches eventChanges', (done) => { 
      function onEventChanged() {
        return done();
      }
      conn.socket.on('eventsChanged', onEventChanged);
      conn.api([{ method: 'events.create', params: { type: 'note/txt', streamId: testStreamId }}]);
    });


    it('Catches streamChanges', (done) => {
      function onStreamChange() {
        return done();
      }
      conn.socket.on('streamsChanged', onStreamChange);
      const res = conn.api([{ method: 'streams.create', params: { id: cuid(), name: cuid(), parentId: testStreamId } }]);
    });

    /** Keep this test the last on of this sequence */
    it('Catches disconnect', (done) => {
      function onDisconnect(reason) {
        expect(reason).to.equal('io client disconnect');
        return done();
      }
      conn.socket.on('disconnect', onDisconnect);
      conn.socket.close();
    });
  }); 

});
