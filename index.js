const MediaServer = require('medooze-media-server');
const { SDPInfo } = require('semantic-sdp');
const internalIp = require('internal-ip');
const express = require('express');
const bodyParser = require('body-parser');

// Init MediaServer
const ip = process.env.IP_ADDRESS || internalIp.v4.sync();
const endpoint = MediaServer.createEndpoint(ip);
const filename = 'recording.mp4';
let incomingStream;
let outgoingStream;
let player;
let recorder;

// Init HTTP server
const app = express();
app.use(express.static('public'));
app.use(bodyParser.text());

// Init RTC connection
app.post('/connect', (req, res) => {
  const offer = SDPInfo.process(req.body);

  const transport = endpoint.createTransport(offer);
  transport.setRemoteProperties(offer);

  const answer = offer.answer({
    dtls: transport.getLocalDTLSInfo(),
    ice: transport.getLocalICEInfo(),
    candidates: endpoint.getLocalCandidates(),
    capabilities: MediaServer.getDefaultCapabilities()
  });

  transport.setLocalProperties(answer);

  incomingStream = transport.createIncomingStream(offer.getFirstStream());

  outgoingStream = transport.createOutgoingStream({
    audio: false,
    video: true
  });
  answer.addStream(outgoingStream.getStreamInfo());

  res.json({
    type: 'answer',
    sdp: answer.toString()
  });
});

// Start recorder
app.get('/recorder-start', () => {
  recorder = MediaServer.createRecorder(filename, { waitForIntra: true });
  recorder.record(incomingStream);
});

// Stop recorder
app.get('/recorder-stop', () => {
  recorder.stop();
});

// Start player
app.get('/player-start', () => {
  player = MediaServer.createPlayer(filename);
  outgoingStream.attachTo(player);
  player.play();
});

// Stop player
app.get('/player-stop', () => {
  player.stop();
});

// Start HTTP server
const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Listening on port ' + listener.address().port);
});
