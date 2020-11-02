function createModel(live2dwmodel) {
    window.L2Dwidget.init({
        pluginRootPath: "./live2dw/",
        pluginJsPath: "./lib/",
        pluginModelPath: "./live2d-widget-model-" + live2dwmodel + "/assets/",
        tagMode: false,
        debug: false,
        model: {
        jsonPath:
            "./live2dw/live2d-widget-model-" +
            live2dwmodel +
            "/assets/" +
            live2dwmodel +
            ".model.json"
        },
        display: { position: "right", width: 200, height: 400 },
        mobile: { show: false },
        log: true
        });
}