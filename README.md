# Medooze Player

This repo provides a demo reproduction of a bug in `Player` component of [Medooze WebRTC Media Server for Node.js](http://github.com/medooze/media-server-node/).

## Installation

1. Clone this repository

```
git clone https://github.com/bakoushin/medooze-player.git`
```

2. Install dependencies and run server:

```
npm install
npm start
```

## Steps to reproduce

1. In a browser, navigate to http://localhost:3000

2. Make a recording: click `Record` button to start recording. After a while stop recording. File `recoding.mp4` will be created in the script directory.

3. Playback a recording: click `Play` button. Playback unexpectedly won't start.

## Expected behaviour

Playback will start and play back recorded file.

## Logs

```
[0x7ff013214740][1568970781.226][LOG]>MP4Streamer::Open() [recording.mp4]
[0x7ff013214740][1568970781.226][LOG]-MP4Streamer::Open() | Found hint track [hintId:2]
[0x7ff013214740][1568970781.227][LOG]-MP4Streamer::Open() | Streaming media [trackId:1,type:"vide",name:"VP8",payload:101]
FindTrackId: Track index doesn't exist - track 1 type hint (../external/mp4v2/lib/src/mp4file.cpp,3002)
[0x7ff013214740][1568970781.227][LOG]-MP4Streamer::Open() | Found hint track [hintId:0]
FindTrackIndex: Track id 0 doesn't exist (../external/mp4v2/lib/src/mp4file.cpp,3016)
FindTrackId: Track index doesn't exist - track 0 type text (../external/mp4v2/lib/src/mp4file.cpp,3002)
[0x7ff013214740][1568970781.228][LOG]>MP4Streamer:Play()
[0x7ff013214740][1568970781.234][LOG]<MP4Streamer:Play()
[0x7fefeffff700][1568970781.234][LOG]>MP4Streamer::PlayLoop()
GetSampleTimes: sample id out of range (../external/mp4v2/lib/src/mp4track.cpp,1100)
```
