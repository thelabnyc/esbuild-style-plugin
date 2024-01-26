const esbuild = require("esbuild");
const stylePlugin = require("../../dist/index");

esbuild.build({
    bundle: true,
    outdir: "./test/using_dist/dist",
    entryPoints: ["./test/using_dist/index.js"],
    plugins: [stylePlugin()],
});
