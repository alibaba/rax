(function(){
  if (navigator.serviceWorker) {
    // 获取到 App Js Runtime 提供的 API 
    // viewappear、生命周期、模块调用
    navigator.serviceWorker.register('/service-worker.js');

    // 接收页面
    navigator.serviceWorker.addEventListener('message', function (event) {
      if (event.data.message) {
        console.log(event.data.message);
      }
      navigator.serviceWorker.controller.postMessage({hello: 'hello'});
    });

  }
})()