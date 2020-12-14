var cfg = {
    server : '203.162.13.227:8001', // dev
    // local
    // server : 'dev.landber.com:6001', // UAT
    serverGetDiaChinh: 'landberagent.com'
};

cfg.rootUrl = `http://${cfg.server}/api`;
cfg.rootDiaChinhUrl = `https://${cfg.serverGetDiaChinh}/api`;
cfg.socketUrl = `http://${cfg.server}`;


cfg.maxWidth = 1024;
cfg.maxHeight = 1024;
cfg.imageQuality = 100;
cfg.imageMinSize = 380;
export default cfg; 