var cfg = {
    server : 'http://localhost', // dev
    port:3000,
    serverGetDiaChinh: "http://toilabeos.herokuapp.com" //product
};

cfg.api = `${cfg.server}:${cfg.port}/`;
// cfg.api = `${cfg.serverGetDiaChinh}/`;

cfg.maxWidth = 1024;
cfg.maxHeight = 1024;
cfg.imageQuality = 100;
cfg.imageMinSize = 380;
export default cfg; 




