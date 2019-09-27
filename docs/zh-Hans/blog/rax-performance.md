---
title: Rax 系列教程（性能）
date: 20171218
author: 冬萌
---

# Rax 系列教程（性能）

性能与体验是前端的核心竞争力，是最直观反应页面是否好用、易用的标准。用户花在页面上的时间不应该是在等待页面加载和响应，而是使用和顺畅浏览的时间，因此如何提升页面性能和体验，让页面更快的可交互、浏览滚动更顺畅，是需要你持续的研究、优化、推进的。在 Rax 不断应用发展以及成熟的过程中，沉淀总结了一系列的性能体验的措施和最佳实践，通过这些，可以帮助你大幅提高页面的各项性能。

## [](#0)加载性能

### [](#1)统计口径

加载性能你可以根据秒开数据作为衡量标准：

> 秒开率 = （加载时间 + 首屏渲染时间）< 1s 的比率

*   加载时间：js bundle 的加载时间（从网络下载或本地加载）
*   首屏渲染时间：Weex 页面开始渲染到第一个超出首屏元素渲染完成的时间

当然，这个统计口径目前看来，其实并不能准确的反应页面首屏真正的 ready 时间。因为大部分页面一般会优先渲染一个铺满首屏的打底图片或者容器，打底元素渲染完成，统计就结束了，此时首屏可能并没有真正的可交互。因此 Weex 新增了数据请求开始和结束的打点，你通过请求结束的时间来初步评估页面可交互时间。

更进一步，为最为真实的反应页面加载的过程和加载完成可交互的时间，你可以使用高速相机录制整个页面的加载过程，后续高速相机的录制会集成进 ATS 的自动化真机测试中。

### [](#2)网络优化

网页的加载离不开网络，其加载展示可以说是从建立连接，网络传输开始的。在 PC 时代，网页一般都是通过浏览器访问，对于网络环节，比如：域名解析等，我们很难干预。而在无线时代，网页的入口掌握在我们自己手中，在 APP 中可以你自己构造并发送 HTTP 请求，真正做到精细化的控制。基于此，我们进行了一些优化，帮助你提升网络速度和质量。

#### [](#3)HTTPDNS 域名解析服务

HTTPDNS 是面向无线端的域名解析服务，与传统走 UDP 协议的 DNS 不同，HTTPDNS 基于 HTTP 协议。

域名解析时，客户端向 HTTPDNS 服务端发送普通的 HTTP 请求，请求中携带需要解析的域名，HTTPDNS 服务端解析出域名对应的 IP 地址，将解析结果封装为 JSON 格式返回给客户端。和传统 DNS，HTTPDNS 的解析结果中包含 TTL（Time To Live），客户端可以根据 TTL 将结果缓存一段时间。

相比于传统的 DNS，HTTPDNS 具有较明显的优势：

*   防止域名劫持
*   更精确的调度
*   更小的解析延迟和波动
*   额外的域名相关信息

目前阿里各 APP 已全部接入，HTTPDNS 同 APP SDK 配合，整体请求时间可减少 17% 左右，改进效果明显。其中客户端在启动时会针对默认白名单域名进行预解析，避免之后请求时的重复解析

因此，需要将你用到的请求域名收敛到一个固定的域名名单中。

### [](#5)图片优化

图片占据着网页的大部分空间，尤其对于电商业务，商品图片占据了页面 90% 以上的空间，因此，优化图片，减少图片体积，可以明显的减少带宽，提升页面的加载性能。

图片优化是技术和视觉博弈的结果，需要你在视觉还原和清晰度的可接受范围内，在保证用户视觉体验的前提下，尽可能的进行优化，减少图片带宽，以提升页面加载性能。

#### [](#6)按需加载

用户只会看到和关注在视口中展示的部分，视口外的部分对用户不可见。因此你没必要将页面全部内容在一开始就全部加载，这样可能会浪费大量的带宽（用户可能压根不会看到那里），而需要尽快展示首屏用户可见的内容，其他不在可视范围内的次屏内容，需要按需展示，当用户浏览到此时再去加载展示。对于图片来说，该优化点尤为重要。首屏图片优先加载，次屏图片按需加载，可以极大的节约带款，提升页面的加载和展示速度。针对图片的按需加载，Rax 提供了图片组件供你选择使用。

*   **rax-picture**。将配置 `lazyload=true` 打开。该懒加载配置只适用于 Rax Web。对于 Weex，你需要使用 **rax-listview** 作为你的滚动容器，其本身会有懒加载机制，只渲染可见区域

#### [](#7)选择正确的图片格式

不同格式的图片拥有不同的有损、无损压缩算法，还支持不同的功能，例如动画和透明度 (alpha) 通道。因此，需要将所需视觉效果与功能要求相结合来为图片选择正确的格式。


| 格式 | 压缩模式 | 透明度 | 动画 |
| --- | --- | --- | --- |
| GIF | 无损 | 支持 | 支持 |
| PNG | 无损 | 支持 | 不支持 |
| JPG | 有损 | 不支持 | 不支持 |
| [WebP](https://developers.google.com/speed/webp/) | 有损/无损 | 支持 | 支持 |


目前普遍支持的图片格式有：GIF、PNG、JPG。除了这些格式外，客户端图片库还支持 WebP 格式，它的总体压缩率更高，图片体积更小。那你如何选择合适的图片格式？

*   你是否需要动画？如果需要，请用程序代码（transition、expressbinding）实现，不要使用 GIF。

    使用 GIF，效果并不理想，会拖累机器性能，同时会偶发 crash 问题。

*   你是否需要使用透明图片？如果需要，请使用 PNG。

    PNG 是支持透明的无损格式，它能生成高质量的图片，但是代价是图片体积比其他格式大得多，使用时需要注意，优先考虑是否可以使用样式代替

*   你是否需要优化图片？如果需要，请使用 JPG

    JPG 可以使用无损和有损优化来减少图片体积，如果不需要透明图片，建议全部使用 JPG 格式。

*   小图片是否使用 base64？不推荐使用

    base64 后会加大增加 js bundle 的大小，bundle 的大小对于渲染性能影响严重，而且 base64 会增加图片解码的开销。权衡下来，不推荐你使用 base64 的图片

在确认好图片格式后，可以考虑给图片增加 WebP 格式变种。

##### [](#8)WebP

WebP，是一种支持有损压缩和无损压缩的图片文件格式，派生自图像编码格式 VP8。根据 Google 官方的数据，无损压缩后的 WebP 比 PNG 文件减少了了 26％ 的大小，有损压缩在具有同等 SSIM 索引的情况下 WebP 比 JPEG 文件[减少了 25 - 34% 的大小](https://developers.google.com/speed/webp/docs/webp_study)。WebP 同时也支持无损透明度（也叫做 alpha 通道）和动画格式。

![](https://gw.alicdn.com/tfs/TB1sXGPRVXXXXXNXXXXXXXXXXXX-796-655.png)

可以明显看到，利用 WebP 格式，一张 PNG 的 Banner 图片，体积减少了 80%。利用 WebP 格式，可以大幅减少图片体积，节约带宽，提高加载性能。目前我们的 APP 已全面支持 WebP 格式，你可以放心的使用，同时我们也提供了自动化的组件，帮你处理 WebP 格式。

*   **rax-picture**。将配置 `autoWebp=true` 打开。该配置只适用于 Rax Web。对于 Weex，客户端底层图片库会自动帮你进行处理。

##### [](#9)解码开销

WebP 更高的压缩比意味着更高的解码开销，解码 WebP 是否造成 CPU 的过大压力，从而得不偿失呢？我们使用下面这张 250x250 的图片进行试验。这张图片既有较细碎的纹理，也有大面积的色块，较为适合研究图片解码的问题。

![](//gw.alicdn.com/tps/TB1kLJjLVXXXXXnaXXXXXXXXXXX-250-250.png)

使用 PNG24 和中等压缩比的 JPG 格式进行比较。


|  | PNG24 | PNG24 => WebP | JPG | JPG => WebP | PNG24 => DataUrl |
| --- | --- | --- | --- | --- | --- |
| 体积 | 29.8k | 8.8k | 20.0k | 13.1k | 131k |
| 解码时间 | 1.04ms | 2.40ms | 2.24ms | 4.47ms | 11.0ms |


*   不管是 WebP 还是 DataUrl 解码仅发生一次，此后对图片的使用与非 WebP 图片完全一致，不会增加开销。
*   WebP 解码工作是由辅助线程 CompositorTileWorker（与 GPU 有关） 完成的，不影响主线程，在一万张不同图片（需要解码一万次）的页面里，不能感受到 WebP 和非 WebP 图片解码带来的明显区别。
*   DataUrl 解码工作是在主线程里进行的，而且不会被翻译为 Decode Image，而是在 parse 阶段。一张上述 DataUrl 的图片，parse 阶段的时间由 1ms 以内，增加到 11ms。

因此，WebP 格式会略微增加图片解码的开销，但是能够大大减少图片的体积。通常，解码工作是由 GPU 完成，对 CPU 和内存影响很小。几乎不会因为 WebP 解码的原因触碰 CPU 或内存的的瓶颈。从前端角度，在任何时候，都应当尽可能使用 WebP 格式图片（只要环境支持）。

而 DataUrl 格式会大幅增加图片解码的开销，增大对 CPU 和内存的开销，同时增加 js bundle 的大小，大幅影响 parse 时间，因此并不推荐使用。

#### [](#10)加载合适的图片

在定义“合适”的图片前，你可能首先需要了解图像分类和屏幕分辨率。

##### [](#11)矢量图像与光栅图像

图像可以分为矢量图像和光栅图像。

*   矢量图像使用线、点和多边形来表示图像。

    矢量图像适用于包含简单几何形状（例如徽标、文本、图标等）的图像，能够在任何分辨率和缩放设置下呈现不失真的清晰的效果。比如 Iconfont 就是矢量图像。

*   光栅图像通过对矩形格栅内的每个像素的值进行编码来表示图像。

    针对复杂的场景，比如照片，矢量图像无法满足需求（可能需要超大量的点、线标记来描述，同时可能依然无法达到所需效果）。此时需要使用光栅图像，我们常用的 GIF、PNG、JPG，包括 WebP 都是光栅图像。光栅图像受屏幕分辨率和缩放的影响，会出现失真、锯齿和模糊等问题（比如放大光栅图像）。因此对于商品图片，在不同屏幕分辨率下，需要提供不同尺寸版本，来保证图片质量和用户的视觉体验。

##### [](#12)屏幕分辨率

在谈论图像像素时，需要分清不同类型的像素：CSS 像素和设备像素。单个 CSS 像素可能包含多个设备像素。比如在 2x 分辨率屏幕上，一个 CSS 像素对应着 2 个设备像素。屏幕分辨率越高，屏幕所能展示的细节就约丰富。

对于矢量图像来说，它和分辨率与缩放无关，在各种高分辨率屏幕下，依然清晰展示。而光栅图像是以像素为单位编码图像数据，受分辨率影响就更加严重。在高分辨率屏幕下，为保证图片质量，保证不失真和模糊，就需要图片更多的像素数，图片文件也就越大。以 100x100 (CSS) 像素显示的图片为例。


| 屏幕分辨率 | 总像素数 | 未压缩文件大小（每像素 4 字节） |
| --- | --- | --- |
| 1x | 100 x 100 = 10,000 | 40,000 字节 |
| 2x | 100 x 100 x 4 = 40,000 | 160,000 字节 |
| 3x | 100 x 100 x 9 = 90,000 | 360,000 字节 |


更高的屏幕分辨率需要更高分辨率的图片，因此需要根据不同的屏幕分辨率加载不同尺寸的图片。

##### [](#13)合适的图片

现在我们可以来定义“合适”的图片了。由于 Weex 对 Iconfont 的支持并不好，你可能暂时无法使用 Iconfont 来实现简单的图形效果。而对于商品图片等内容和色彩丰富的图片，就需要使用光栅图。所谓合适的图片，是根据不同的环境场景来选择最优的图片展示，目前你需要区分的主要有两类场景因素

*   屏幕分辨率

    不同的屏幕分辨率你需要选择不同尺寸的图片来保证用户的视觉体验。


    | 屏幕分辨率 | 显示尺寸 | 所需自然尺寸 |
    | --- | --- | --- |
    | 1x | 100 x 100 | 100 x 100 |
    | 2x | 100 x 100 | 200 x 200 |
    | 3x | 100 x 100 | 300 x 300 |


    选择最合适的图片尺寸，不仅可以保证图片质量，还可以减少不必要的内存消耗。图片尺寸过小，可能会导致图片失真，而图片尺寸过大，就会造成额外的内存消耗。


    | 屏幕分辨率 | 自然尺寸 | 显示尺寸 | 不必要的像素 | 不必要的内存消耗 |
    | --- | --- | --- | --- | --- |
    | 1x | 110 x 110 | 100 x 100 | 110 x 110 - 100 x 100 = 2,100 | 2,100 * 4 / 1,024 = 8.2KB |
    | 2x | 110 x 110 | 100 x 100 | (110 x 110 - 100 x 100) * 4 = 8,400 | 8,400 * 4 / 1,024 = 32.8KB |
    | 3x | 110 x 110 | 100 x 100 | (110 x 110 - 100 x 100) * 9 = 18,900 | 18,900 * 4 / 1,024 = 73.8KB |


    因此根据显示尺寸选择最接近的尺寸，CDN 提供了很多尺寸供你选择。

*   网络环境

    不同的网络环境需要不同的图片策略，弱网条件下（2g/3g），用户需要的更多的是尽快加载内容，因此在弱网条件下适当降低图片质量，来提高加载速度，是更优的选择。而在强网条件下（4g/wifi），加载速度可以较大限度的保证，保证图片质量，提高浏览体验则会更加重要。CDN 提供了质量控制的能力.目前我们推荐强网条件下使用 `Q75/Q50`，弱网条件下使用 `Q30s150`。需要注意的是，质量控制只对 JPG 有效，这也是对于商品图片我们规定使用 JPG 格式的重要原因。

针对分辨率和网络环境，我们提供了自动化的组件 **rax-picture**，方便的根据不同分辨率设置不同尺寸的图片，同时识别网络环境，增加质量控制。而对于 Weex 来说，客户端底层图片库同样会自动帮你进行处理。

### [](#14)接口收敛

首屏数据收敛，保证首屏只有一个数据接口，对于性能来说，收益是十分明显的。

*   数据预加载的优化措施，一个页面只能预加载一个接口，而首屏收敛为一个接口后，可以完美的利用数据预加载的优化，使用数据预加载后，拿到数据的时间基本可以提前 80%（下文具体讲到）。
*   展示体验效果提升，首屏接口返回后，首屏内容全部同步渲染，不会出现有的部分还是空白等待异步接口返回，有的部分已经渲染展示出来的情况，同时也不会有页面撑开闪动的情况。其展示浏览体验得以保证。

你可以接入 命运石(搭建系统)，用数据驱动渲染。利用命运石搭建体系的能力，将不同投放数据源的数据统一整合，帮你将首屏数据合并为一个接口。其余内容你可以放到次屏，通过翻页参数控制。前端只需要负责模块的渲染逻辑，至于模块内容、模块顺序、个性化等完全由命运石的数据逻辑控制。

![](https://img.alicdn.com/tfs/TB1Xq1nRpXXXXXjaXXXXXXXXXXX-1446-851.png_720x720)

除了上面接口收敛的好处外，接入命运石，你还可以享受到：

*   前端只负责渲染逻辑，运营的数据修改只需要发布数据，不会涉及到页面代码的改动，可以大大减少前端页面的发布频率，尤其是进行了 zcache 的页面，减少 zcache 的发布频率，可以很好的保证其较高的到达更新率
*   数据统一收敛后，其容灾、字段标准化等都统一进行了处理，不需要前端开发者额外的工作量，同时保证页面的稳定性

### [](#15)资源预加载

进入无线时代后，受限于网络环境，依然存在着很多困境和瓶颈，特别是弱网环境，比如 2G/3G 的低网速，会极大拖慢页面资源的加载，导致页面打开慢，甚至打不开，用户体验十分糟糕。因此资源缓存，减少网络请求，避免网络环境对页面的影响，目前看是行之有效的改进方案。

为此我们的客户端实现了一套资源缓存预加载的方案，将页面资源以 zip 形式打包发布，客户端通过预置或者异步下载的方式安装更新 zip 包，页面资源访问优先匹配客户端本地的资源 zip 包，以此减少网络请求，提升加载性能。

#### [](#16)流程方案

![](https://gw.alicdn.com/tfs/TB11GYSRVXXXXbRaXXXXXXXXXXX-506-538.png)

该方案在客户端有两部分组成。

*   **更新模块**。负责下载和维护客户端本地的资源包，它会定时去服务端拉取“总控”文件，总控文件包含了所有资源包的配置信息，其中包括了资源包的版本、zip 包下载地址等，客户端根据该配置去 CDN 上下载对应的 zip 包，解压到本地。
*   **访问模块**。负责拦截页面中的资源请求，通过 URL 的规范和本地的资源包配置来判断是否读取本地资源，否则读取线上资源。此外如果读取本地文件的过程中发生异常也会重新路由到线上。

使用资源预加载后，加载性能提升十分显著。预加载的官方数据是：手淘 iOS，走网络平均 296ms，走预加载 18ms，网络性能提升约 15 倍；手淘 Android，走网络平均是 696ms，走预加载是 54ms，网络性能提升约 12 倍，但绝对值更大，对 Android 会场秒开贡献更为突出。当然这前提是预加载到达率至少在 80% 以上，到达率越高，基本秒开率越高。根据过去的定量分析，Android 下到达率每提升 10%，Android 的秒开率从 70% 左右开始每增加 3% 左右；iOS 下到达率每提升 10%，iOS 秒开率从 80% 左右开始每增加 1.4%。

目前预加载方案有三种类型

*   **PackageApp**。将页面资源全部离线化（包括 HTML、CSS、JS、Image、Iconfont），同时限制访问路径在同一个目录下
*   **zcache 1.0**。zcache 1.0 不限制访问路径，不同目录的页面资源可以放在一起。同时不参与包的淘汰策略，即 zip 下载后，不会因为流量过低而触发淘汰策略自动被删除。一般遇到双 11、双 12 的大促场景才会使用。
*   **zcache 2.0**。限制访问路径，参与包的淘汰策略，一般产品推荐使用 zcache 2.0 方式。需要注意的是同目录下的页面不要分别放到 1.0 和 2.0 中，由于 zcache 的实现的问题，会导致 1.0 下的页面无法命中

根据上述流程你会发现，当资源 zip 包下载到用户手机本地后，才能享受到预加载带来的加载性能提升。

![](https://gw.alicdn.com/tfs/TB1oIEaRVXXXXXnaXXXXXXXXXXX-804-432.png)

因此如何保证资源 zip 包的尽快触达是十分重要的。

#### [](#17)资源下载触达

提高资源 zip 测触达率对提高加载性能至关重要。

*   优先使用预加载资源的被动更新方式，只有在做不兼容改动和修复线上问题时才使用强制更新的方式

    资源发布时，有两种资源 zip 的更新方式。

    *   被动更新：如果客户端本地存在 zip 包，不论这个包是否是最新，优先访问本地的 zip 包。客户端静默下载更新新包。也就是说，等你发布资源后，用户看到的可能还是老的资源，等用户客户端更新下来新的资源包，访问就是新的资源。该方式可以最大限度的保证加载性能。
    *   强制更新：如果客户端本地的 zip 包是老的，则会跳过，直接访问线上 CDN 的资源，保证用户访问的一定是新发布的资源。当你做了不兼容改动或者修复线上问题时，需要使用该方式。

    > 需要注意的是，更新方式的修改是需要配置下发到客户端才可以实现，如果你发布时，更新方式从被动更新修改为强制更新，在配置下发到客户端之前，用户的客户端访问方式依然是被动方式。

    为保证你的加载性能，应该尽量避免做不兼容的改动

*   控制发布频率，推荐一周不超过两次

    资源 zip 包发布后，大约一周时间会覆盖到 98% 的用户，而频繁的发布行为，会导致资源包的更新速度变慢，覆盖周期变长，影响加载性能。

*   适度调整资源包的更新优先级

    正常的资源包的优先级为 5 （越高优先级越高，最高为 9）。高流量页面，可以申请提高更新优先级。

#### [](#18)资源是否正确加入预加载资源包

查看页面资源是否正确的加入了预加载资源包里，你可以打开 AWP的 PACKAGE管理 > 离线资源 > 解combo查询，输入查询地址，如果是“下线”状态，则代表资源没有预加载成功，不会被推送到手淘客户端，此时，你需要中心操作，将页面资源加入。

![](https://img.alicdn.com/tps/TB1GFC1PXXXXXaTXpXXXXXXXXXX-1042-135.png)

#### [](#19)资源包是否正确触达客户端

你可以方便的查看本地存在的资源包，打开客户端（手淘），来查看自己的资源包是否正确触达当前客户端。

#### [](#20)资源访问是否真正命中预加载资源包

当然就算你已经将资源添加进了预加载包中，同时资源包确实推动到了客户端本地，但是有可能因为 bug 或者 url 路径配置错误等原因，导致资源的访问没有真正命中客户端本地的资源。对此你可能需要进一步做些验证。你可以尝试一下步骤:

选择手淘 debug 包，访问需要验证的页面。“摇一摇”唤起 Weex Analyzer，查看 Weex 性能指标，其中 `weex_bundlejs_requestType` 为 `packageApp` 时表示命中了本地的预加载资源，如果为 `network`，则资源没有命中。

![](https://img.alicdn.com/tps/TB12cevPXXXXXX3aXXXXXXXXXXX-883-748.jpg_600x600)

#### [](#21)查询线上真实触达率

在 air 数据地图 中，会统计页面线上真实的预加载资源包的触达率，方便你掌握真实的线上情况。

### [](#22)JS Prefetch

JS Prefetch  可以在页面跳转前，事先发送下一个页面 bundle 的下载请求，从而提高下一跳的响应速度。

```
import prefetch from '@ali/universal-prefetch';
prefetch.addTask(url, ignoreParamsList);

```

其中

*   url：需要提前下载缓存的下一跳 bundle 的 url 地址
*   ignoreParamsList：数组类型，表示处理时需要忽略的 url 参数，js prefetch 缓存的 url 是全量匹配，因此该参数可以帮助你忽略掉 url 中某些参数（如埋点）的影响。比如：


    ```
    //m.taobao.com/test?itemId=1
    //m.taobao.com/test?itemId=2

    ```

    其 bundle 内容相同，url 参数不同，如果你只对第一个 url 进行 JS Prefetch 设置，则第二个不会命中其缓存。如果两个都进行 JS Prefetch 配置，则会产生冗余重复的缓存数据。此时就需要设置 `ignoreParamsList=[itemId]`，js prefetch 会忽略参数 `itemId`，认为两个 url 是相同的。

通过对 JS Prefetch 的设置调用，Weex 会在页面渲染过程中异步的下载该 js bundle 文件，并存储至 Cache 中。当用户访问该 js 文件时，优先从 Cache 中获取。其中如果 js bundle 本身命中 zcache，则 JS Prefetch 后续操作不会再继续执行。

![](https://gw.alicdn.com/tfscom/TB1QyguPXXXXXc5XXXXXXXXXXXX_720x720.jpg)

使用 JS Prefetch 需要你较为准确的预测用户下一跳的行为。可以通过点击热图，流量路径等辅助你进行预测判断。目前 JS Prefetch 主要用来作为 zcache 未到达时的补充，资源的缓存和预加载依然主要依靠 zcache。当然如果你对下一跳行为预测准确的话，JS Prefetch 依然能达到和 zcache 相媲美的程度。


### [](#23)数据预加载（Data Prefetch）

数据预加载(Data Prefetch)是用来将页面中需要请求的数据提前请求。大幅缩短用户看到页面效数据的等待时间，提高用户体验。

![](https://img.alicdn.com/tps/TB1EdVpOpXXXXbKXXXXXXXXXXXX-934-298.png_720x720)

用户新打开一个 Weex 页面，Weex 在解析 url 时，会判断是否存在 `data_prefetch=true` 的参数，如果有，则认为该页面应用了数据预加载，然后会以页面 url 作为 key，去检索 Data Prefetch 通过 packageapp 下发的 map 映射表，其对应的 value 值既是需要 prefetch 的请求的参数。

![](https://gw.alicdn.com/tfs/TB1OKI0ih6I8KJjy0FgXXXXzVXa-958-712.png_600x600)

Weex 使用该参数发起请求，并将请求结果写入 Storage 中。此时页面 JS 并行的在执行，当使用数据预加载发起请求时，会直接从 Storage 读取请求结果（会轮训等待 1s，如果获取不到则请求线上）。

根据过去业务的真实测试（采样率 10%）。大约节约 80% 的请求时间。

![](https://img.alicdn.com/tps/TB1WjZOOXXXXXX4aXXXXXXXXXXX-1044-100.png_720x720)

实际体验也能明显发现感官上的差异，同样的测试环境，数据预加载接入 ifashion 首页做对比，网址列表中第二个链接使用了数据预加载，而第一个链接没使用。

![](https://gw.alicdn.com/tps/TB1qOQRPFXXXXXVXFXXXXXXXXXX-320-564.gif)

#### [](#30)注意事项

*   数据预加载一个页面只支持一个接口，因此需要你将首屏接口收敛
*   保证接入配置的正确性，配置错误会导致 Data Prefetch 参数对比失败，造成额外消耗
*   如果确保是第一个请求应用 Data Prefetch，建议开启 `isFirstScreenRequest` 配置，减少后续请求前置逻辑的消耗
*   `offlineData` 需要谨慎使用，打开后，Data Prefetch 会优先读取本地已经缓存的数据，等新数据返回后在进行更新，对于时间切换等实时性较高的数据，不要开启使用

### [](#31)减少 bundle size

JS Bundle 的大小直接影响了 Android 下 js 执行时间，代码量每增加 1k，纯渲染时间增加 1-2ms，渲染性能和代码量 Android下是强相关的。

![](https://static.dingtalk.com/media/lALOfsgzqM0BhM0CDA_524_388.png_620x10000.jpg)

同时 bundle 过大也会占用 zcache 资源，对于 web 资源不会推送 zcache 来说，也会增加资源的加载时间，因此减少 bundle 大小，对于页面秒开还是十分重要的。

##### [](#32)依赖治理

*   依赖废弃替换

    Rax 发展过程中，不可避免的产生了一些历史遗留问题，存在一些废弃的依赖。这些依赖可能会让你的项目引入很多无用代码，或者这些依赖可以用全局 framework 提供的方法代替。

    *   某些依赖只用于 web 端，不需要引入，在 `web.xtpl` 模板中内联其 JS 脚本即可。不然你的 Weex Bundle 中会打入这些无用代码
        *   `@ali/lib-mtop`
        *   `@ali/lib-windvane`
        *   `@ali/lib-promise`
        *   `@ali/lib-login`
    *   某些依赖已经废弃，或者可以用全局 framework 提供的方法代替。更多全局变量可以参考 Rax 全局 API
        *   `@ali/universal-alert`：使用 `window.alert` 代替
        *   `@ali/universal-dimensions`：使用 `window.screen` 代替
        *   `@ali/universal-fetch`：使用 `fetch` 代替
        *   `@ali/universal-location`：使用 `location` 代替
        *   `@ali/universal-window`：使用 `window` 代替
        *   `@ali/universal-stylesheet`：废弃，直接使用 style 或者 css
    *   按需引用，未使用到的依赖不要引入

        *   `@ali/rax-components`/`rax-components`：rax-components 中包含了所有基础组件，很多你可能并没有使用，但是打包时会全部打入你的 bundle 中（webpack 目前无法升级，无法使用 tree-shaking）。因此请不要再使用 `@ali/rax-components`/`rax-components`，其中的基础组件已经全部剥离，你只要按需引用即可。


            ```
            import View from 'rax-view';
            import Text from 'rax-text';
            import Image from 'rax-image';
            import Picture from 'rax-picture';
            import TextInput from 'rax-textinput';
            import Button from 'rax-button';
            import Switch from 'rax-switch';
            import Video from 'rax-video';
            import ScrollView from 'rax-scrollview';
            import Slider from 'rax-slider';
            import ListView from 'rax-listview';
            import RecycleView from 'rax-recyclerview';
            import RefreshControl from 'rax-refreshcontrol';
            import TouchableHighlight from 'rax-touchable';

            ```


    *   其他

        *   `@ali/universal-webp`，其用来检测图片是否可用 webp。内置到 `rax-picture` 中，不需要自己再引用进行判断
        *   `@ali/universal-downgrade`，当你需要对单独页面进行降级控制时使用，通用的降级配置，推荐在 `weex.xtpl` 中进行控制

    如果你接入了门神(系统)流程，那在你预发代码时，门神的 lint 规则会帮你检测依赖引用，结果会在 Rax Lint 一项中以 warning 形式展示。

    ![](https://gw.alicdn.com/tfs/TB1ntEaf5qAXuNjy1XdXXaYcVXa-2728-828.png_720x720)

*   依赖去重

    对于依赖的版本号：major.minor.patch，有以下规则。


    ```
    "rax": "*", // 任何版本都可
    "rax": "0.4.2", // 必须匹配这个版本
    "rax": "0.x.x", // 版本的 major 为0，minor和path 可以是任意一个值
    "rax": "^0.2.3", // 最左边一个非0版本号的右侧可向上兼容，即 >=0.2.3 <0.3.0
    "rax": "~0.2.3", // 如果minor和patch缺少，就认为他们的值是 * 。如果是全的如~0.2.3，就认为是 >=0.2.3 <0.3.0
    "rax": ">0.4.2", // 必须大于这个版本
    "rax": ">=0.4.2" // 必须大于等于这个版本
    "rax": "<0.4.2" // 必须小于这个版本
    "rax": "<=0.4.2" // 必须小于等于这个版本
    "rax": "0.3.0 - 0.4.20" // 在这个范围内
    "rax": "<0.3.0 || >=0.4.0 <0.4.20" // 满足其中任何一个都可

    ```


    所以，各模块有可能根据各自的依赖规则产生出了对同一个库的重复引用。这种情况是很常见的，比如 A 库引了 C 库，要求是 `c:1.x.x` 版本, B 库引的却是 `c:2.x.x` 版本。甚至项目本身依赖的又是 `c:3.x.x`。最终导致依赖多版本共存。

    如果你使用的是 def 工程化体系，你可以方便的可视化的看到重复依赖的部分。比如通过 `def dev` 后的控制台信息

    ![](https://gw.alicdn.com/tfs/TB1Dll4ayqAXuNjy1XdXXaYcVXa-727-248.png)

    或者通过 `def dev` 时开启的本地可视化的开发平台页面进行排查，通过其中的资源分析，你可以直观的看到重复依赖的部分

    ![](https://gw.alicdn.com/tfs/TB1uzUJcRfH8KJjy1XbXXbLdXXa-512-465.png)

##### [](#33)JS Service 内置

为进一步减少页面 bundle 的大小，我们将一些基础和通用组件内置到了客户端中，过去使用的是 weex-rax-framework 内置组件方案，将组件打包进 weex jsfm。但是随着需要内置的组件较多，打包进 weex jsfm 后原有大小从 240K 上涨了一倍，有 498K（minify 后），同时 weex-rax-framework 中内置的 ali 内部业务组件会通过打包走到开源发布流程。

因此，我们使用了新的内置方案：JS service。将我们需要内置的组件注册进 JS service 的方法中，集成在客户端。JS service 和 Weex 实例在 JS runtime 中并行运行。Weex 实例的生命周期可调用 JS service 生命周期。在 Rax framework createInstance 方法中会将 service 对象传递下来。Rax 环境中通过全局变量 `__weex_config__` 可以访问 service 注册的方法。如果你需要使用内置的 `universal-env` 组件，你可以用如下代码替换掉 bundle 中的 `universal-env` 组件代码.


```
    var _NormalService = new __weex_config__.services.service.RaxNormalService(__weex_config__.services);
    _NormalService.universalEnv(window.define, null, window);

```


通过内置方式，页面的 bundle 大小平均可以减少 150k 左右，针对内置效果我们进行了前期测试，测试机型：红米，Android 版本：4.4.2，手淘版本：6.11.0（示例页面仅包含20个通用组件，无业务逻辑）。


|  | 大小 | firstScreenJSFExecureTime（ms） | 首屏时间（ms） |
| --- | --- | --- | --- |
| [完整 bundle](//groups.alidemo.cn/raxjs/demo-market/demo/neizhibao/bundle.full.js) | 259k | 397 | 674 |
| [内置 bundle](//groups.alidemo.cn/raxjs/demo-market/demo/neizhibao/bundle.full-min2.js) | 61k | 137 | 360 |


同时 JS service 可以动态下发，更新起来更加及时方便（推荐还是跟随客户端发版）。

目前内置组件替换已经自动化的接入了命运石搭建体系，其搭建的页面会自动的使用内置的组件。对于使用 def 开发的源码页面，需要你自己配置 abc.json，设置需要替换的内置组件，目前功能还在灰度中，可以联系 @上坡 进行体验。目前稳定的可以使用的内置组件有：

*   universal-env/0.4.20
*   rax-view/0.4.20
*   rax-text/0.4.20
*   rax-image/0.4.20
*   rax-touchable/0.4.20
*   rax-scrollview/0.4.20
*   rax-refreshcontrol/0.4.20
*   rax-link/0.4.20
*   universal-panresponder/0.4.20
*   rax-recyclerview/0.4.20
*   rax-video/0.4.20
*   rax-switch/0.4.20
*   rax-textinput/0.4.20
*   rax-listview/0.4.20
*   rax-button/0.4.20
*   rax-picture/0.4.20
*   rax-icon/0.4.20
*   @ali/universal-mtop/1.4.0
*   @ali/universal-goldlog/3.5.4
*   @ali/universal-spm/1.2.0
*   @ali/universal-windvane/1.0.4
*   @ali/rax-weitao-follow/0.1.0
*   @ali/rax-get-timestamp/0.0.2

当然内置方案也存在弊端，你需要特别注意。

*   目前只适用于较为短期的活动页面，对于长期稳定页面（尤其是缺维护的页面）目前无法不保证组件的向前兼容，不兼容情况下可能无法保证页面的稳定性。
*   在不支持 JS service 或者没下发到的客户端上，你需要自己配置降级规则，让页面降级到 H5，整体来说，Native 化率比起非内置的页面来说会可能低几个百分点。对于命运石的搭建页面来说，降级逻辑是统一配置的，而源码页面，目前还需要你自己添加。


    ```
    isDowngrade = __weex_downgrade__({
        ios: {
            osVersion: '',
            appVersion: '<6.11.2',
            weexVersion: '',
            deviceModel: []
        },
        android: {
            osVersion: '<=4.2.2',
            appVersion: '<6.11.0',
            weexVersion: '',
            deviceModel: []
        }
    });
    if (isDowngrade) return;
    var _NormalService;
    if (typeof __weex_config__ == 'object' && __weex_config__.services &&
        __weex_config__.services.service && __weex_config__.services.service.RaxNormalService) {
        _NormalService = new __weex_config__.services.service.RaxNormalService(__weex_config__.services);
    }
    if (!_NormalService) {
        isDowngrade = true;
    } else {
        var normalServiceModules = [
            'aliUniversalMtop', 'aliUniversalGoldlog',
            'aliUniversalSpm', 'aliUniversalWindvane',
            'aliRaxWeitaoFollow', 'aliUniversalShare',
            'aliRaxGetTimestamp', 'universalEnv',
            'raxView', 'raxText',
            'raxImage', 'raxTouchable',
            'raxScrollview', 'raxRefreshcontrol',
            'raxLink', 'universalPanresponder',
            'raxRecyclerview', 'raxVideo',
            'raxSwitch', 'raxTextinput',
            'raxListview', 'raxButton',
            'raxPicture', 'raxIcon'
        ];
        for (var i = 0; i < normalServiceModules.length ; i++) {
            if (!_NormalService[normalServiceModules[i]]) {
                isDowngrade = true;
                break;
            }
        }
    }
    if (isDowngrade) {
        var instanceWrap = __weex_require__('@weex-module/instanceWrap');
        if (instanceWrap && instanceWrap.error) instanceWrap.error(1, 1000, 'Downgrade[rax]:: no built-in rax components');
        return;
    }

    ```


##### [](#34)其他

利用 webpack 一些功能，你还可以进一步优化 bundle size 的大小

*   code split

    如果你是基于 def 开发，在 abc.json 中你可以开启 code split 插件以实现代码分离。目前[淘宝头条](https://market.m.taobao.com/apps/market/toutiao/portal.html?wh_weex=true&_wx_appbar=true%EF%BC%8C)尝试了 code split 方式，优化结果的统计和对比待补充。

*   tree shaking

    使用 tree shaking 可以帮助你移除没有使用的代码，进一步减少 bundle size。如果你是基于 def 开发，很遗憾的是 def 使用的 webpack 还停留在 1.0 的阶段，目前无法升级，因此该功能暂时无法使用

## [](#35)渲染性能

优化提升渲染性能，不仅能让页面更快的展现、可交互，同时能提升用户操作滚动的流畅度，对提升用户体验至关重要。

### [](#36)避免不必要的更新对比

Rax 同 React 一样，render 时会有 vdom 对比，如果对比发现 DOM 没有变化时，不会去真正更新页面。而本身 vdom 对比也是不小的消耗，你应该避免这种不必要的更新对比，使用 `shouldComponentUpdate` 方法明确标识你的组件什么时候需要更新，什么时候不需要更新。或者你的组件也可以继承 `PureComponent`，进行简单的属性浅比较。当然对于大部分业务场景，你的组件在渲染完后并不需要更新，你最好显式的阻止更新。


```
shouldComponentUpdate(nextProps, nextState) {
    return false;
}

```


### [](#37)唯一 key 值

不管是在 React 还是 Rax 里，都会有相同高效的 Diff 算法，而这个 Diff 算法主要依赖于两个场景：

1.  两个相同组件产生类似的 DOM 结构，不同的组件产生不同的 DOM 结构
2.  对于同一层次的一组子节点，它们可以通过唯一的 id 进行区分

而 key 值就是 Diff 算法在第二个场景的应用。通常你在渲染一个列表后，会对其进行一些操作，包括添加、删除和排序，在 Rax/React 中，如果你在没有对列表项进行标识的情况下在中间进行插入操作的时候，列表项往往会出现渲染性能问题。


```
<ul>
    <li>A</li>
    <li>B</li>
    <li>C</li>
    <li>D</li>
    <li>E</li>
</ul>

// 在 B 后面插入 F
<ul>
    <li>A</li>
    <li>B</li>
    <li>F</li>
    <li>C</li>
    <li>D</li>
    <li>E</li>
</ul>

```


这种情况下，Rax/React 无法识别每一个节点，不能保障之前渲染好的子节点（A-E）保持不变，更新渲染会比较低效，实际情况就变成了将 C 更新成 F，D 更新成 C，E 更新成 D，最后再插入一个 E 节点。这种情况下有些子节点会被销毁重新 Mount，性能差。

![](https://gw.alicdn.com/tfs/TB14xuniwvD8KJjSsplXXaIEFXa-572-215.png)

如果你在对应的子节点加上 key 标识，Rax/React 就能通过 Diff 算法来进行识别进行高效地更新。


```
<ul>
    <li key="a">A</li>
    <li key="b">B</li>
    <li key="c">C</li>
    <li key="d">D</li>
    <li key="e">E</li>
</ul>

// 在 B 后面插入 F
<ul>
    <li key="a">A</li>
    <li key="b">B</li>
    <li key="f">F</li>
    <li key="c">C</li>
    <li key="d">D</li>
    <li key="e">E</li>
</ul>

```


这种情况下只做 F 节点的插入，其余子节点不会被重新 Mount，渲染性能也会有所提高。

![](https://gw.alicdn.com/tfs/TB1BrSSiBDH8KJjSspnXXbNAVXa-565-201.png)

因此，在渲染一些列表数组数据的时候，你需要在子元素标签上加上 key 属性，且尽量保证 key 属性的值是唯一的可预测的，尽量使用数据自带的一些 id 值，或者自定义保证唯一的字符串。

### [](#38)不要渲染空字符串

在你需要返回或者渲染空组件时，不要使用空字符串。


```
<View>
    {
        name ? <View>{name}</View> : ''
    }
</View>

```


在 Rax 中，渲染空字符串，对应 Weex 上会额外渲染一个 View，造成渲染上的浪费。你需要返回 `null` 来代替。


```
<View>
    {
        name ? <View>{name}</View> : null
    }
</View>

```


### [](#39)减少 render 方法的复杂度

在 Rax/React 中，当组件状态更新时，会不断的调用 `render` 方法，意味着你放在 `render` 方法的中代码逻辑、函数调用等也是每次都会被执行，如果是跟组件状态无关的函数，建议不要放到 render 方法中。


```
// bad
class App extends Component {
    render() {
        const {height} = Dimensions.get("window");
        return <View>{height}</View>;
    }
}

// good。不需要每次获取 window 高度
const {height} = Dimensions.get("window");
class App extends Component {
    render() {
        return <View>{height}</View>;
    }
}

```


### [](#40)jsx no bind

通过在 jsx 节点上绑定时间，你可以监听处理用户行为。而通常你需要将事件处理函数的作用域绑定到当前组件。你最新想到的可能是用 `bind` 或者内联箭头函数。


```
<View onClick={(e) => this.handle(e)} />
<View onClick={this.handle.bind(this)} />

```


而使用 `bind` 或者内联的箭头函数，在每次 render 的时候都会创建一个全新的函数，造成额外的消耗，比如垃圾回收要做更多的工作，如果是方法通过 props 透传给子组件，每次透传的都是新创建的函数，可能会导致子组件执行不必要的更新。你可以采取以下的方式进行事件绑定。


```
class Example1 {
    handle = () => {
        // handle click
    }
    render() {
        return (<View onClick={this.handle} />>);
    }
}

// 如果你需要传递参数
class Example1 {
    handle = (id) => {
        // handle click
    }
    render() {
        return (
            <View>
                <HandelView id={1} onClick={this.handle} />
                <HandelView id={2} onClick={this.handle} />
            </View>
        );
    }
}
class HandelView {
    handle = () => {
        const {id, onClick} = this.props;
        onClick(id);
    }
    render() {
        return (<View onClick={this.handle} />);
    }
}

```


### [](#41)减少 console.log

为了调试方便，你可能会在代码中写下一大堆 `console.log`，而在 Weex 环境中，并不提倡如此。

Weex 容器有两个上下文，一个是 Native Context，一个是 JS Context，两个环境的切换是存在成本的。JS 与 Native 通信有两种方式，其一是直接调用 Native 在 JS Context 注入的方法；其二是将 JS 代码 parse 成 Native 执行，然后通过 JS Context 中注入的方法回调返回给 JS。

`console.log` 采用的就是第二种方式，你应该尽可能地减少两个上下文相互切换的开销成本，如果需要通过 Console 来 debug，你可以通过 URL 参数来判断是否开启 Console，或者在 Weex 中使用原生的 NativeLog 打印日志。

### [](#42)优先使用 ListView

在 Weex 中，常用的长列表容器有 list 和 scroller，推荐你优先考虑使用 list，其在 Rax 中对应的 rax-listview 组件。list 在 Native 中分别对应 iOS 的 UITableView 和 Android 的 RecyclerView，list 本身的好处有：

*   只会渲染可见区域，减少首屏的渲染消耗
*   内存复用，所有滑动到不可见区域的 cell 都会被系统回收，用于渲染下一个 cell
*   cell 之间天然互相隔离， 可以默认以 cell 维度划分并用 tree 的模式解析，提高渲染效率
*   拥有原生的交互体验，在 cell 上点击、左滑、右滑、移动排序等交互方式后续可以更方便地支持

同时，对于 list 的滑动帧率，我们也做了优化处理，进行了异步绘制，将 view 中要显示的内容，包括背景色、透明底、边框、圆角、文字等，提前在异步线程绘制出来，形成一张图片。这样当用户真正往下滑的时候， 只需要在主线程做两件事：创建 native view 和 把绘制好的图片设置到 view 上。

![](//ata2-img.cn-hangzhou.img-pub.aliyun-inc.com/c3e5c3d310bc1803f65cb12fb94501cb)

而 scroller 在 Native 中对应的是 UIScrollView/ScrollView， 加载以后会把所有元素都渲染出来，如果列表较长，一定程度上会拉长首屏渲染时间以及首屏可操作时间，同时首屏就把列表所有图片加载出来一定程度上也会带来一些网络、内存的压力。同时 scroller 过长时，由于是一次性渲染，在较低端机器上，可能会导致 crash。

#### [](#43)拆分细粒度的小 cell

ListView 中的每个 cell 需要尽可能细粒度的拆分，保证每个 cell 的简单。list 为保证滚动的流畅，进行了异步渲染，其中 create view 依然是在主线程中进行，当一个 list 的 cell 比较复杂，包含了较多的 view，此时 create veiw 就会耗时严重，可能超过 16ms，在用户手机上表现就是要出现这个 cell 时会明显卡一下，所以你需要尽可能去拆分 cell 使得渲染细粒度化。 比如对于商品列表页面来说，最佳实践一般是一排商品一个 cell。

### [](#44)控制嵌套层级

你需要将页面的 vdom 层级控制在 14 层以下，过大的嵌套层级会导致页面渲染时间加长，严重的会导致低端手机 crash。

#### [](#45)影响渲染时间

从 JS 的 DOM JSON 到 Native View 的 render 过程来看。

![](//ata2-img.cn-hangzhou.img-pub.aliyun-inc.com/34edd57973c21d1ff00862d7309c55bf)

整个 render 过程包含六步

*   Build Tree：将 JSON 格式的数据还原成一个树形的对象结构
*   Compute Style：将样式展开， 应用到上一步创建的树形结构上
*   CSS Layout：通过 layout 算法计算 Flex 布局
*   Create View：创建组件名所对应的 native view，比如在 iOS， div 对应 UIView，image 对应 UIImageView
*   Update Frame：根据计算出来的布局去更新 view 的宽高和左上角座标
*   Set View Props：应用 View 的样式属性以及事件等

在 Weex 的渲染机制下，每一个 Rax View 容器都会对应一个 Native 的 view。每多一层嵌套，Native 都要 create view，会增加主线程渲染时间和内存占用。

#### [](#46)加剧 crash 风险

当层级嵌套过高时，会增加客户端的 crash 风险，尤其是 Android 的低端机器。以真实的业务为例，当前套层级达到 20 层后，其 Android crash 率显著上涨。

![](//gw.alicdn.com/tfs/TB1NN8ZOFXXXXaZXFXXXXXXXXXX-703-415.png_600x600)

经过优化，嵌套层级减少到 14 层后，crash 率明显下降，趋于正常：

![](//gw.alicdn.com/tfs/TB1t2HeOFXXXXabXXXXXXXXXXXX-674-339.png_600x600)

#### [](#47)查看嵌套层级

*   最简单的方法是直接查看 Web 端 html 的嵌套层级

    这种方式比较粗略，可以初步估计层级，vdom 层级 上会比 Web 层级更多，Web 上超过 14 层，vdom 上一定也会超过。

*   使用 Weex Analyzer

    目前的手淘 debug 包都已经集成了 Weex Analyzer 工具。你只需在当前页面摇一摇即可打开 Weex Analyzer。其中提供了真实的 vdom 层级查看

    ![](//gw.alicdn.com/tfs/TB1sUF6PXXXXXXvapXXXXXXXXXX-438-652.png_400x400)

*   通过 [ATS](//ats.alibaba-inc.com/) 自动化真机测试

    你可以通过 [ATS](//ats.alibaba-inc.com/) 对需要的页面进行真机测试，结果中会清楚的显式页面最大的嵌套层级。

    ![](https://gw.alicdn.com/tfs/TB1PPnFir_I8KJjy1XaXXbsxpXa-2322-1184.png_720x720)

## [](#48)内存

作为前端，你可能很少去关注内存，但是性能来说，内存是直观重要的一环。一旦过度占用，可能会导致页面卡顿，用户浏览体验下降，更严重的，可能会导致 crash 的问题。

### [](#49)内存指标

针对不同的终端和页面类型，我们制定了不同的内存标准

*   Android
    *   没有视频内容
        *   单页整体内存不超过 50M
        *   Native heap 不超过 30M
        *   Android java heap 不超过 20M
        *   页面切后台后内存存留，java heap 不超过 5M，Native heap 不超过 15M。
    *   存在视频内容
        *   单页整体内存不超过 70M
        *   Native heap 不超过 50M
        *   Android java heap 不超过 20M
        *   页面切后台后内存存留，java heap 不超过 5M，Native heap 不超过 30M
    *   页面反复进出内存不升高
*   iOS
    *   页面内存增量不超过 40M
    *   iPhone7 及以上机型，内存增量在上述基础上可增加 20%（因为其内存有 2G）
    *   页面压栈后出栈，内存可以回到压栈前的水位

### [](#50)内存测试

内存的测试也是十分简单，iOS 上你可以通过手淘 debug 包中的掌中测，方便的查看页面的内存指标。

![](https://gw.alicdn.com/tfs/TB1kv2iiwvD8KJjy0FlXXagBFXa-620-1102.png_600x600)

对于 Android 来说，你可以用下面命令来获取当前时刻手淘的内存占用量（取 Heap Alloc）

![](https://private-alipayobjects.alipay.com/alipay-rmsdeploy-image/skylark/png/a0b38ef0-84b4-4463-9fef-e97f2c6685a8.png)

同时使用 Android Studio的 Android Monitor 可以很方便的获取 Java Heap。通过手动 GC，你可以验证页面退出后 Java Heap 是否回归原始水位（增量不超过 2M）

![](https://private-alipayobjects.alipay.com/alipay-rmsdeploy-image/skylark/png/1706e8e9-a4f1-4e55-8deb-4748a4809b7e.png)

### [](#51)视频优化

视频本身会占用较大的内存，因此你在使用视频时需要特别注意。

*   视频压缩。页面中使用的视频建议进行压缩，减少视频的大小
*   上传至淘视频。上传到淘视频的视频，我们可以做统一的精细控制，比如视频限流、视频降级已经清晰度保障等等
*   选择合适的清晰度。页面中播放的视频，很多都是嵌入到坑位中，和商品、资源位等混排，本身尺寸不会很大，选择标清的清晰度会更加合适
*   控制视频播放。如果你需要视频自动播放，那需要保证只有在视口中的唯一一个视频播放，同时在滑出视口不可见时，需要停止播放。
### [](#52)图片优化

我们大部分页面都是列表型页面，其中会展示大量的图片，图片本身会占用较多的内存。因此你可以采取一些措施减少图片的大小

*   图片优化。参考前文所讲的图片优化
*   图片压缩。较大的 banner 图片，建议使用前进行压缩处理，好的压缩算法可以减少图片近一半的大小
*   禁止使用 gif。gif 图片会占用大量的内存空间

### [](#53)动画优化

如果你的页面存在循环播放的动画，当动画不可见时，你需要停止动画，保证当前视口运行任务的最简。

*   模块消失。当模块消失在可视区域时，动画需要暂停，当模块重新出现在可视区域再恢复动画。
*   页面消失。当离开当前页面时循环动画需要被中止掉。
*   异步动画。如果动画是异步执行（transition 异步调用），有可能此时页面实例已经销毁，所以需要在调用前判断上下文。

