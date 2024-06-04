import autoprefixer from "autoprefixer";
import * as esbuild from "esbuild";
import "jest";
import path from "path";
import scss from "postcss-scss";

import stylePlugin from "../../src/index";

const basePath = "./test/postcss_plugins";

test("PostCSS plugins", async () => {
    await esbuild.build({
        entryPoints: [path.join(basePath, "src/index.ts")],
        outdir: path.join(basePath, "dist"),
        bundle: true,
        plugins: [
            stylePlugin({
                postcss: {
                    parser: scss,
                    plugins: [autoprefixer],
                },
            }),
        ],
    });
});
