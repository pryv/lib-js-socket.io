const Pryv = require('pryv');
require('../src/')(Pryv);

let apiEndpoint = 'https://ckbcft5ai0004z60sbsmv56mc@my-computer.rec.la:4443/perki/';
//apiEndpoint = 'https://ckbdyn3dm0003dwnk07yfsqbs@my-computer.rec.la:4443/perki/';

const conn = new Pryv.Connection(apiEndpoint);



(async () => { 
  try {
    console.log('a');
    const s = await conn.socket.open();
    s.on('eventsChanged', () => {
      console.log('XXXXX eventsChanged');
    });
    const res = await conn.socket.api([{method: 'events.get', params: {}}]);
    console.log('Youpii', res);
  } catch (e) {
    console.log('>>>>>>', e.message);
  }
})();