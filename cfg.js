var cfg = {
    server : 'http://localhost', // dev
    port:3000,
    serverGetDiaChinh: 'landberagent.com'
};

// cfg.rootUrl = `http://${cfg.server}/api`;
// cfg.rootDiaChinhUrl = `https://${cfg.serverGetDiaChinh}/api`;
// cfg.socketUrl = `http://${cfg.server}`;

cfg.api = `${cfg.server}:${cfg.port}/`;

cfg.maxWidth = 1024;
cfg.maxHeight = 1024;
cfg.imageQuality = 100;
cfg.imageMinSize = 380;
export default cfg; 