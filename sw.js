//Service Worker安装后请求首页并将首页缓存
self.addEventListener('install', function (event) {
    var indexPage = new Request('index.html');
    event.waitUntil(
        fetch(indexPage).then(function (response) {
            return caches.open('cache-homePage').then(function (cache) {
                return cache.put(indexPage, response);
            });
        }));
});

//如果请求失败则先从缓存请求
self.addEventListener('fetch', function (event) {
    var updateCache = function (request) {
        return caches.open('cache-homePage').then(function (cache) {
            return fetch(request).then(function (response) {
                return cache.put(request, response);
            });
        });
    };

    event.waitUntil(updateCache(event.request));

    event.respondWith(
        fetch(event.request).catch(function (error) {
            //查看缓存中是否存在
            return caches.open('cache-homePage').then(function (cache) {
                return cache.match(event.request).then(function (matching) {
                    var report = !matching || matching.status == 404 ? Promise.reject('no-match') : matching;
                    return report
                });
            });
        })
    );
})

//监听推送
self.addEventListener('push', function (e) {
    var options = {
        body: 'Here is a notification body!', //主体内容
        icon: 'images/example.png', //通知图标
        vibrate: [100, 50, 100], //震动，先100ms然后暂停50ms最后在震动100ms
        data: { //通知数据，用于人机交互
            dateOfArrival: Date.now(),
            primaryKey: 1
        }
    };
    self.registration.showNotification('Hello world!', options);
});