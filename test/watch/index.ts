import tailwindcss from "@tailwindcss/postcss";
import * as esbuild from "esbuild";
import atImport from "postcss-import";

import stylePlugin from "../../src/index";

const consoleLogPlugin: esbuild.Plugin = {
    name: "console-log-plugin",
    setup(build) {
        build.onEnd((result) => {
            if (result.errors.length > 0) {
                console.error("watch build failed:", result.errors);
            } else {
                console.log("watch build succeeded:", result);
            }
        });
    },
};

esbuild
    .context({
        entryPoints: ["./test/watch/src/index.ts"],
        outdir: "./test/watch/dist",
        bundle: true,
        plugins: [
            consoleLogPlugin,
            stylePlugin({
                postcss: {
                    plugins: [atImport(), tailwindcss()],
                },
            }),
        ],
    })
    .then(async (context) => {
        context.watch();
    });
