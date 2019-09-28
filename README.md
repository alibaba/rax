<p align="center">
  <a href="https://alibaba.github.io/rax">
    <img alt="Rax" src="https://user-images.githubusercontent.com/677114/59907138-e99f7180-943c-11e9-8769-07021d9fe1ca.png" width="66">
  </a>
</p>

<p align="center">
The fastest way to build universal application.
</p>

<p align="center">
  <a href="https://github.com/alibaba/rax/blob/master/LICENSE"><a href="https://opencollective.com/rax" alt="Financial Contributors on Open Collective"><img src="https://opencollective.com/rax/all/badge.svg?label=financial+contributors" /></a> <img src="https://img.shields.io/npm/l/rax.svg"></a>
  <a href="https://www.npmjs.com/package/rax"><img src="https://img.shields.io/npm/v/rax.svg"></a>
  <a href="https://www.npmjs.com/package/rax"><img src="https://img.shields.io/npm/dm/rax.svg"></a>
  <a href="https://travis-ci.org/alibaba/rax"><img src="https://travis-ci.org/alibaba/rax.svg?branch=master"></a>
  <a href="https://unpkg.com/rax/dist/rax.min.js"><img src="https://img.badgesize.io/https://unpkg.com/rax/dist/rax.min.js?compression=gzip&?maxAge=3600" alt="gzip size"></a>
</p>

---

:christmas_tree: **Familiar:** React compatible API with Class Component and Hooks.

:candy: **Tiny:** ~6.4 KB minified + gzipped.

:earth_asia: **Universal:** works with DOM, Weex, Node.js, Mini-program, WebGL and could work more container that implements [driver specification](./docs/en-US/driver-spec.md).

:banana: **Easy:** using via `rax-cli` with zero configuration, one codebase with universal UI toolkit & APIs.

:lollipop: **Friendly:** developer tools for Rax development.


## Quick Start

Create a new Rax project using `create-rax`:

```sh
$ npm init rax <YourProjectName>
```

Start local server to launch project:

```sh
$ cd <YourProjectName>
$ npm install
$ npm run start
```

### Developer Tools

You can inspect and modify the state of your Rax components at runtime using the
[React Developer Tools](https://github.com/facebook/react-devtools) browser extension.

1. Install the [React Developer Tools](https://github.com/facebook/react-devtools) extension
2. Import the "rax/lib/devtools" module in your app
  ```js
  import 'rax/lib/devtools';
  ```
3. Set `process.env.NODE_ENV` to 'development'
4. Reload and go to the 'React' tab in the browser's development tools


## Contributing

Want to file a bug, contribute some code, or improve documentation? Excellent! Read up on our [guidelines for contributing](./.github/CONTRIBUTING.md).


### Contributors

Thanks goes to these wonderful people:

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://yuanyan.github.io"><img src="https://avatars1.githubusercontent.com/u/677114?v=4" width="64px;" alt="元彦"/><br /><sub><b>元彦</b></sub></a><br /><a href="https://github.com/alibaba/rax/commits?author=yuanyan" title="Code">💻</a></td>
    <td align="center"><a href="https://zeroling.com"><img src="https://avatars1.githubusercontent.com/u/3922719?v=4" width="64px;" alt="ZeroLing"/><br /><sub><b>ZeroLing</b></sub></a><br /><a href="https://github.com/alibaba/rax/commits?author=wssgcg1213" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/yacheng"><img src="https://avatars2.githubusercontent.com/u/1745426?v=4" width="64px;" alt="亚城"/><br /><sub><b>亚城</b></sub></a><br /><a href="https://github.com/alibaba/rax/commits?author=yacheng" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/Arichy"><img src="https://avatars3.githubusercontent.com/u/29599723?v=4" width="64px;" alt="Arichy"/><br /><sub><b>Arichy</b></sub></a><br /><a href="https://github.com/alibaba/rax/commits?author=Arichy" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/chenjun1011"><img src="https://avatars3.githubusercontent.com/u/1303018?v=4" width="64px;" alt="水澜"/><br /><sub><b>水澜</b></sub></a><br /><a href="https://github.com/alibaba/rax/commits?author=chenjun1011" title="Code">💻</a></td>
    <td align="center"><a href="http://huxiaoqi567.github.io/"><img src="https://avatars3.githubusercontent.com/u/1961484?v=4" width="64px;" alt="胡潇琪"/><br /><sub><b>胡潇琪</b></sub></a><br /><a href="https://github.com/alibaba/rax/commits?author=huxiaoqi567" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/boiawang"><img src="https://avatars3.githubusercontent.com/u/6340730?v=4" width="64px;" alt="岭伊"/><br /><sub><b>岭伊</b></sub></a><br /><a href="https://github.com/alibaba/rax/commits?author=boiawang" title="Code">💻</a></td>
  </tr>
  <tr>
    <td align="center"><a href="http://solojiang.github.io"><img src="https://avatars3.githubusercontent.com/u/14757289?v=4" width="64px;" alt="狒狒神"/><br /><sub><b>狒狒神</b></sub></a><br /><a href="https://github.com/alibaba/rax/commits?author=SoloJiang" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/imsobear"><img src="https://avatars0.githubusercontent.com/u/2505411?v=4" width="64px;" alt="大果"/><br /><sub><b>大果</b></sub></a><br /><a href="https://github.com/alibaba/rax/commits?author=imsobear" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/playing"><img src="https://avatars2.githubusercontent.com/u/5006825?v=4" width="64px;" alt="playing(五晨)"/><br /><sub><b>playing(五晨)</b></sub></a><br /><a href="https://github.com/alibaba/rax/commits?author=playing" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/zhangmengxue"><img src="https://avatars1.githubusercontent.com/u/6252911?v=4" width="64px;" alt="Skylar艺璇"/><br /><sub><b>Skylar艺璇</b></sub></a><br /><a href="https://github.com/alibaba/rax/commits?author=zhangmengxue" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/kingback"><img src="https://avatars2.githubusercontent.com/u/471003?v=4" width="64px;" alt="ningzbruc"/><br /><sub><b>ningzbruc</b></sub></a><br /><a href="https://github.com/alibaba/rax/commits?author=kingback" title="Code">💻</a></td>
    <td align="center"><a href="http://alvinhui.lofter.com"><img src="https://avatars3.githubusercontent.com/u/4392234?v=4" width="64px;" alt="许文涛"/><br /><sub><b>许文涛</b></sub></a><br /><a href="https://github.com/alibaba/rax/commits?author=alvinhui" title="Code">💻</a></td>
    <td align="center"><a href="https://gaohaoyang.github.io"><img src="https://avatars3.githubusercontent.com/u/7655995?v=4" width="64px;" alt="浩阳"/><br /><sub><b>浩阳</b></sub></a><br /><a href="https://github.com/alibaba/rax/commits?author=Gaohaoyang" title="Code">💻</a></td>
  </tr>
  <tr>
    <td align="center"><a href="https://hijiangtao.js.org/"><img src="https://avatars1.githubusercontent.com/u/4990015?v=4" width="64px;" alt="Joe Jiang"/><br /><sub><b>Joe Jiang</b></sub></a><br /><a href="https://github.com/alibaba/rax/commits?author=hijiangtao" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/jasminecjc/Ideas/issues"><img src="https://avatars0.githubusercontent.com/u/13568376?v=4" width="64px;" alt="jaminecjc"/><br /><sub><b>jaminecjc</b></sub></a><br /><a href="https://github.com/alibaba/rax/commits?author=jasminecjc" title="Code">💻</a></td>
    <td align="center"><a href="https://www.xcodebuild.com/"><img src="https://avatars3.githubusercontent.com/u/5436704?v=4" width="64px;" alt="xcodebuild"/><br /><sub><b>xcodebuild</b></sub></a><br /><a href="https://github.com/alibaba/rax/commits?author=xcodebuild" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/Ahkari"><img src="https://avatars3.githubusercontent.com/u/8937572?v=4" width="64px;" alt="Ahkari卡狸"/><br /><sub><b>Ahkari卡狸</b></sub></a><br /><a href="https://github.com/alibaba/rax/commits?author=Ahkari" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/BakuJun"><img src="https://avatars2.githubusercontent.com/u/16538695?v=4" width="64px;" alt="BakuJun"/><br /><sub><b>BakuJun</b></sub></a><br /><a href="https://github.com/alibaba/rax/commits?author=BakuJun" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/dongyuwei"><img src="https://avatars3.githubusercontent.com/u/112451?v=4" width="64px;" alt="dongyuwei"/><br /><sub><b>dongyuwei</b></sub></a><br /><a href="https://github.com/alibaba/rax/commits?author=dongyuwei" title="Code">💻</a></td>
    <td align="center"><a href="https://fraserxu.me"><img src="https://avatars3.githubusercontent.com/u/1183541?v=4" width="64px;" alt="Fraser Xu"/><br /><sub><b>Fraser Xu</b></sub></a><br /><a href="https://github.com/alibaba/rax/commits?author=fraserxu" title="Code">💻</a></td>
  </tr>
  <tr>
    <td align="center"><a href="https://github.com/HMenen"><img src="https://avatars2.githubusercontent.com/u/15607391?v=4" width="64px;" alt="HMenen"/><br /><sub><b>HMenen</b></sub></a><br /><a href="https://github.com/alibaba/rax/commits?author=HMenen" title="Code">💻</a></td>
    <td align="center"><a href="https://raincal.com"><img src="https://avatars1.githubusercontent.com/u/6279478?v=4" width="64px;" alt="Raincal"/><br /><sub><b>Raincal</b></sub></a><br /><a href="https://github.com/alibaba/rax/commits?author=Raincal" title="Code">💻</a></td>
    <td align="center"><a href="http://taiyoslime.hatenablog.com/"><img src="https://avatars2.githubusercontent.com/u/11515982?v=4" width="64px;" alt="Taiyo Mizuhashi"/><br /><sub><b>Taiyo Mizuhashi</b></sub></a><br /><a href="https://github.com/alibaba/rax/commits?author=taiyoslime" title="Code">💻</a></td>
    <td align="center"><a href="https://medium.com/@wjwang"><img src="https://avatars3.githubusercontent.com/u/2817235?v=4" width="64px;" alt="William Wang(Wei)"/><br /><sub><b>William Wang(Wei)</b></sub></a><br /><a href="https://github.com/alibaba/rax/commits?author=WJWang" title="Code">💻</a></td>
    <td align="center"><a href="http://d12mnit.github.io/"><img src="https://avatars3.githubusercontent.com/u/13366123?v=4" width="64px;" alt="yelzm"/><br /><sub><b>yelzm</b></sub></a><br /><a href="https://github.com/alibaba/rax/commits?author=d12mnit" title="Code">💻</a></td>
    <td align="center"><a href="https://efcl.info/"><img src="https://avatars1.githubusercontent.com/u/19714?v=4" width="64px;" alt="azu"/><br /><sub><b>azu</b></sub></a><br /><a href="https://github.com/alibaba/rax/commits?author=azu" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/crazybear"><img src="https://avatars3.githubusercontent.com/u/2849777?v=4" width="64px;" alt="Nan Zhao"/><br /><sub><b>Nan Zhao</b></sub></a><br /><a href="https://github.com/alibaba/rax/commits?author=crazybear" title="Code">💻</a></td>
  </tr>
  <tr>
    <td align="center"><a href="http://noyobo.com"><img src="https://avatars1.githubusercontent.com/u/1292082?v=4" width="64px;" alt="大宝"/><br /><sub><b>大宝</b></sub></a><br /><a href="https://github.com/alibaba/rax/commits?author=noyobo" title="Code">💻</a></td>
    <td align="center"><a href="https://orange-c.github.io/blog/"><img src="https://avatars1.githubusercontent.com/u/8469262?v=4" width="64px;" alt="oraaange"/><br /><sub><b>oraaange</b></sub></a><br /><a href="https://github.com/alibaba/rax/commits?author=Orange-C" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/yongningfu"><img src="https://avatars2.githubusercontent.com/u/9846613?v=4" width="64px;" alt="yongningfu"/><br /><sub><b>yongningfu</b></sub></a><br /><a href="https://github.com/alibaba/rax/commits?author=yongningfu" title="Code">💻</a></td>
    <td align="center"><a href="https://dong.ninja"><img src="https://avatars3.githubusercontent.com/u/16359169?v=4" width="64px;" alt="Dong Yun"/><br /><sub><b>Dong Yun</b></sub></a><br /><a href="https://github.com/alibaba/rax/commits?author=DoranYun" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/frankLife"><img src="https://avatars1.githubusercontent.com/u/5081884?v=4" width="64px;" alt="franklife"/><br /><sub><b>franklife</b></sub></a><br /><a href="https://github.com/alibaba/rax/commits?author=frankLife" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/balloonzzq"><img src="https://avatars3.githubusercontent.com/u/15956075?v=4" width="64px;" alt="晓旸"/><br /><sub><b>晓旸</b></sub></a><br /><a href="https://github.com/alibaba/rax/commits?author=balloonzzq" title="Code">💻</a></td>
    <td align="center"><a href="http://tinple.io"><img src="https://avatars3.githubusercontent.com/u/5363119?v=4" width="64px;" alt="Tinple"/><br /><sub><b>Tinple</b></sub></a><br /><a href="https://github.com/alibaba/rax/commits?author=Tinple" title="Code">💻</a></td>
  </tr>
  <tr>
    <td align="center"><a href="http://1q88.cn"><img src="https://avatars0.githubusercontent.com/u/5954671?v=4" width="64px;" alt="battle ooze"/><br /><sub><b>battle ooze</b></sub></a><br /><a href="https://github.com/alibaba/rax/commits?author=battle-ooze" title="Code">💻</a></td>
    <td align="center"><a href="http://yujiangshui.com/"><img src="https://avatars3.githubusercontent.com/u/2942913?v=4" width="64px;" alt="Harry Yu"/><br /><sub><b>Harry Yu</b></sub></a><br /><a href="https://github.com/alibaba/rax/commits?author=yujiangshui" title="Code">💻</a></td>
    <td align="center"><a href="https://clarence-pan.github.io"><img src="https://avatars2.githubusercontent.com/u/8750132?v=4" width="64px;" alt="Clarence Pan"/><br /><sub><b>Clarence Pan</b></sub></a><br /><a href="https://github.com/alibaba/rax/commits?author=Clarence-pan" title="Code">💻</a></td>
    <td align="center"><a href="https://www.gengjiawen.com"><img src="https://avatars1.githubusercontent.com/u/3759816?v=4" width="64px;" alt="Jiawen Geng"/><br /><sub><b>Jiawen Geng</b></sub></a><br /><a href="https://github.com/alibaba/rax/commits?author=gengjiawen" title="Code">💻</a></td>
    <td align="center"><a href="https://94cstyles.github.io/shell/"><img src="https://avatars2.githubusercontent.com/u/3605154?v=4" width="64px;" alt="94cstyles"/><br /><sub><b>94cstyles</b></sub></a><br /><a href="https://github.com/alibaba/rax/commits?author=94cstyles" title="Code">💻</a></td>
    <td align="center"><a href="http://limn.me"><img src="https://avatars1.githubusercontent.com/u/10400425?v=4" width="64px;" alt="Alex.li"/><br /><sub><b>Alex.li</b></sub></a><br /><a href="https://github.com/alibaba/rax/commits?author=lmnsg" title="Code">💻</a></td>
    <td align="center"><a href="https://dalisoft.uz"><img src="https://avatars0.githubusercontent.com/u/3511344?v=4" width="64px;" alt="Davlat Shavkatov"/><br /><sub><b>Davlat Shavkatov</b></sub></a><br /><a href="https://github.com/alibaba/rax/commits?author=dalisoft" title="Code">💻</a></td>
  </tr>
  <tr>
    <td align="center"><a href="http://evanyou.me"><img src="https://avatars1.githubusercontent.com/u/499550?v=4" width="64px;" alt="Evan You"/><br /><sub><b>Evan You</b></sub></a><br /><a href="https://github.com/alibaba/rax/commits?author=yyx990803" title="Code">💻</a></td>
    <td align="center"><a href="https://gerhut.me/"><img src="https://avatars1.githubusercontent.com/u/2500247?v=4" width="64px;" alt="George Cheng"/><br /><sub><b>George Cheng</b></sub></a><br /><a href="https://github.com/alibaba/rax/commits?author=Gerhut" title="Code">💻</a></td>
    <td align="center"><a href="https://longzhou.me"><img src="https://avatars2.githubusercontent.com/u/1685674?v=4" width="64px;" alt="LongZhou"/><br /><sub><b>LongZhou</b></sub></a><br /><a href="https://github.com/alibaba/rax/commits?author=JesonRondo" title="Code">💻</a></td>
    <td align="center"><a href="https://zh.wikipedia.org/wiki/User:Artoria2e5"><img src="https://avatars2.githubusercontent.com/u/6459309?v=4" width="64px;" alt="Mingye Wang"/><br /><sub><b>Mingye Wang</b></sub></a><br /><a href="https://github.com/alibaba/rax/commits?author=Artoria2e5" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/RyanLiu0235"><img src="https://avatars2.githubusercontent.com/u/5373041?v=4" width="64px;" alt="Ryan Liu"/><br /><sub><b>Ryan Liu</b></sub></a><br /><a href="https://github.com/alibaba/rax/commits?author=RyanLiu0235" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/supersylar"><img src="https://avatars0.githubusercontent.com/u/6358060?v=4" width="64px;" alt="Sylar"/><br /><sub><b>Sylar</b></sub></a><br /><a href="https://github.com/alibaba/rax/commits?author=supersylar" title="Code">💻</a></td>
    <td align="center"><a href="https://gitter.im"><img src="https://avatars2.githubusercontent.com/u/8518239?v=4" width="64px;" alt="The Gitter Badger"/><br /><sub><b>The Gitter Badger</b></sub></a><br /><a href="https://github.com/alibaba/rax/commits?author=gitter-badger" title="Code">💻</a></td>
  </tr>
  <tr>
    <td align="center"><a href="https://twitter.com/timkevinoxley"><img src="https://avatars1.githubusercontent.com/u/43438?v=4" width="64px;" alt="Tim Kevin Oxley"/><br /><sub><b>Tim Kevin Oxley</b></sub></a><br /><a href="https://github.com/alibaba/rax/commits?author=timoxley" title="Code">💻</a></td>
    <td align="center"><a href="http://basilzhang.com"><img src="https://avatars2.githubusercontent.com/u/19166761?v=4" width="64px;" alt="Basil Zhang"/><br /><sub><b>Basil Zhang</b></sub></a><br /><a href="https://github.com/alibaba/rax/commits?author=zhangyu921" title="Code">💻</a></td>
    <td align="center"><a href="https://amdgigabyte.github.io"><img src="https://avatars2.githubusercontent.com/u/296426?v=4" width="64px;" alt="ZhangZipeng"/><br /><sub><b>ZhangZipeng</b></sub></a><br /><a href="https://github.com/alibaba/rax/commits?author=amdgigabyte" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/buaaljy"><img src="https://avatars1.githubusercontent.com/u/8011964?v=4" width="64px;" alt="buaaljy"/><br /><sub><b>buaaljy</b></sub></a><br /><a href="https://github.com/alibaba/rax/commits?author=buaaljy" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/leanhunter"><img src="https://avatars3.githubusercontent.com/u/3183822?v=4" width="64px;" alt="leanhunter"/><br /><sub><b>leanhunter</b></sub></a><br /><a href="https://github.com/alibaba/rax/commits?author=leanhunter" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/appli456"><img src="https://avatars1.githubusercontent.com/u/8943691?v=4" width="64px;" alt="appli456"/><br /><sub><b>appli456</b></sub></a><br /><a href="https://github.com/alibaba/rax/commits?author=appli456" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/ljybill"><img src="https://avatars2.githubusercontent.com/u/31462342?v=4" width="64px;" alt="ljybill"/><br /><sub><b>ljybill</b></sub></a><br /><a href="https://github.com/alibaba/rax/commits?author=ljybill" title="Code">💻</a></td>
  </tr>
  <tr>
    <td align="center"><a href="http://yifeiyuan.me"><img src="https://avatars3.githubusercontent.com/u/6982439?v=4" width="64px;" alt="程序亦非猿"/><br /><sub><b>程序亦非猿</b></sub></a><br /><a href="https://github.com/alibaba/rax/commits?author=AlanCheen" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/peasLi"><img src="https://avatars3.githubusercontent.com/u/10102335?v=4" width="64px;" alt="peasLi"/><br /><sub><b>peasLi</b></sub></a><br /><a href="https://github.com/alibaba/rax/commits?author=peasLi" title="Code">💻</a></td>
    <td align="center"><a href="http://www.rccoder.net"><img src="https://avatars3.githubusercontent.com/u/7554325?v=4" width="64px;" alt="Shangbin Yang"/><br /><sub><b>Shangbin Yang</b></sub></a><br /><a href="https://github.com/alibaba/rax/commits?author=rccoder" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/leedut"><img src="https://avatars2.githubusercontent.com/u/10243337?v=4" width="64px;" alt="Kevin Lee"/><br /><sub><b>Kevin Lee</b></sub></a><br /><a href="https://github.com/alibaba/rax/commits?author=leedut" title="Code">💻</a></td>
    <td align="center"><a href="http://corneys.cn"><img src="https://avatars0.githubusercontent.com/u/11909865?v=4" width="64px;" alt="ukk"/><br /><sub><b>ukk</b></sub></a><br /><a href="https://github.com/alibaba/rax/commits?author=zunyan" title="Code">💻</a></td>
    <td align="center"><a href="http://havefive.github.io"><img src="https://avatars3.githubusercontent.com/u/5222554?v=4" width="64px;" alt="zhaocai"/><br /><sub><b>zhaocai</b></sub></a><br /><a href="https://github.com/alibaba/rax/commits?author=havefive" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/mrme2014"><img src="https://avatars0.githubusercontent.com/u/10045233?v=4" width="64px;" alt="mrme2014"/><br /><sub><b>mrme2014</b></sub></a><br /><a href="https://github.com/alibaba/rax/commits?author=mrme2014" title="Code">💻</a></td>
  </tr>
  <tr>
    <td align="center"><a href="https://github.com/ggd543"><img src="https://avatars2.githubusercontent.com/u/224629?v=4" width="64px;" alt="刘永健"/><br /><sub><b>刘永健</b></sub></a><br /><a href="https://github.com/alibaba/rax/commits?author=ggd543" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/hudidit"><img src="https://avatars1.githubusercontent.com/u/2347723?v=4" width="64px;" alt="哈哈胡子"/><br /><sub><b>哈哈胡子</b></sub></a><br /><a href="https://github.com/alibaba/rax/commits?author=hudidit" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/bluemsn"><img src="https://avatars0.githubusercontent.com/u/3715420?v=4" width="64px;" alt="松鹤"/><br /><sub><b>松鹤</b></sub></a><br /><a href="https://github.com/alibaba/rax/commits?author=bluemsn" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/kahing7"><img src="https://avatars3.githubusercontent.com/u/23146851?v=4" width="64px;" alt="神奇的少年"/><br /><sub><b>神奇的少年</b></sub></a><br /><a href="https://github.com/alibaba/rax/commits?author=kahing7" title="Code">💻</a></td>
    <td align="center"><a href="http://www.ayqy.net/"><img src="https://avatars2.githubusercontent.com/u/12402989?v=4" width="64px;" alt="黯羽轻扬"/><br /><sub><b>黯羽轻扬</b></sub></a><br /><a href="https://github.com/alibaba/rax/commits?author=ayqy" title="Code">💻</a></td>
    <td align="center"><a href="http://www.w3cfuns.com/space-uid-5427233.html"><img src="https://avatars0.githubusercontent.com/u/9896768?v=4" width="64px;" alt="yangfan"/><br /><sub><b>yangfan</b></sub></a><br /><a href="https://github.com/alibaba/rax/commits?author=fyangstudio" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/fengwuxp"><img src="https://avatars2.githubusercontent.com/u/19926995?v=4" width="64px;" alt="风"/><br /><sub><b>风</b></sub></a><br /><a href="https://github.com/alibaba/rax/commits?author=fengwuxp" title="Code">💻</a></td>
  </tr>
  <tr>
    <td align="center"><a href="https://demohi.com"><img src="https://avatars3.githubusercontent.com/u/1209159?v=4" width="64px;" alt="Desen Meng"/><br /><sub><b>Desen Meng</b></sub></a><br /><a href="https://github.com/alibaba/rax/commits?author=demohi" title="Code">💻</a></td>
  </tr>
</table>

<!-- markdownlint-enable -->
<!-- prettier-ignore-end -->
<!-- ALL-CONTRIBUTORS-LIST:END -->

---
**[⬆ back to top](#top)**

## Contributors

### Code Contributors

This project exists thanks to all the people who contribute. [[Contribute](CONTRIBUTING.md)].
<a href="https://github.com/alibaba/rax/graphs/contributors"><img src="https://opencollective.com/rax/contributors.svg?width=890&button=false" /></a>

### Financial Contributors

Become a financial contributor and help us sustain our community. [[Contribute](https://opencollective.com/rax/contribute)]

#### Individuals

<a href="https://opencollective.com/rax"><img src="https://opencollective.com/rax/individuals.svg?width=890"></a>

#### Organizations

Support this project with your organization. Your logo will show up here with a link to your website. [[Contribute](https://opencollective.com/rax/contribute)]

<a href="https://opencollective.com/rax/organization/0/website"><img src="https://opencollective.com/rax/organization/0/avatar.svg"></a>
<a href="https://opencollective.com/rax/organization/1/website"><img src="https://opencollective.com/rax/organization/1/avatar.svg"></a>
<a href="https://opencollective.com/rax/organization/2/website"><img src="https://opencollective.com/rax/organization/2/avatar.svg"></a>
<a href="https://opencollective.com/rax/organization/3/website"><img src="https://opencollective.com/rax/organization/3/avatar.svg"></a>
<a href="https://opencollective.com/rax/organization/4/website"><img src="https://opencollective.com/rax/organization/4/avatar.svg"></a>
<a href="https://opencollective.com/rax/organization/5/website"><img src="https://opencollective.com/rax/organization/5/avatar.svg"></a>
<a href="https://opencollective.com/rax/organization/6/website"><img src="https://opencollective.com/rax/organization/6/avatar.svg"></a>
<a href="https://opencollective.com/rax/organization/7/website"><img src="https://opencollective.com/rax/organization/7/avatar.svg"></a>
<a href="https://opencollective.com/rax/organization/8/website"><img src="https://opencollective.com/rax/organization/8/avatar.svg"></a>
<a href="https://opencollective.com/rax/organization/9/website"><img src="https://opencollective.com/rax/organization/9/avatar.svg"></a>
