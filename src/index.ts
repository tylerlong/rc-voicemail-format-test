import RingCentral from '@rc-ex/core';
import path from 'path';
import fs from 'fs';

const rc = new RingCentral({
  clientId: process.env.RINGCENTRAL_CLIENT_ID,
  clientSecret: process.env.RINGCENTRAL_CLIENT_SECRET,
  server: process.env.RINGCENTRAL_SERVER_URL,
});

const main = async () => {
  await rc.authorize({
    username: process.env.RINGCENTRAL_USERNAME!,
    extension: process.env.RINGCENTRAL_EXTENSION,
    password: process.env.RINGCENTRAL_PASSWORD!,
  });
  const r = await rc
    .restapi()
    .account()
    .extension()
    .messageStore()
    .list({
      messageType: ['VoiceMail'],
      dateFrom: '2016-03-10T18:07:52.534Z',
      direction: ['Inbound'],
    });
  // console.log(JSON.stringify(r, null, 2));

  const r2 = await rc.get<Buffer>(
    r.records![0].attachments![0].uri ?? '',
    undefined,
    {
      responseType: 'arraybuffer',
    }
  );
  fs.writeFileSync(path.join(__dirname, 'temp.wav'), r2.data);
};

main();
