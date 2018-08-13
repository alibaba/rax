# rax-video [![npm](https://img.shields.io/npm/v/rax-video.svg)](https://www.npmjs.com/package/rax-video)

## Install

```bash
$ npm install --save rax-video
```

## Props

| property    | type     | default  | description         |
| :---------- | :------- | :------- | :-------------------|
| src         | string   | null     | The URL of the video to embed.  |
| autoPlay    | boolean  | false    | If specified, the video automatically begins to play back as soon as it can do so without stopping to finish loading the data.|
| muted      | boolean  | false    | A Boolean attribute which indicates the default setting of the audio contained in the video. If set, the audio will be initially silenced. Its default value is false, meaning that the audio will be played when the video is played. |
| loop       | boolean  | false    | If specified, will upon reaching the end of the video, automatically seek back to the start. |
| controls   | boolean  | true     | If specified, will offer controls to allow the user to control video playback, including volume, seeking, and pause/resume playback. |
| poster     | string   | null    | A URL indicating a poster frame to show until the user plays or seeks. If this attribute isn't specified, nothing is displayed until the first frame is available; then the first frame is shown as the poster frame. |
| playControl | string  | pause    | One of `play` and `pause`, controls the playback. If not set, the value of `autoPlay` determines whether the video plays when the component is loaded. |
| onEnded | function | null | Option callback evoked when video is done playing. |
