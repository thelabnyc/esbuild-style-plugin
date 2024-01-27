import * as esbuild from "esbuild";
import "jest";
import path from "path";

import stylePlugin from "../../src/index";

const basePath = "./test/render_options";

test("Test sassOptions", async () => {
    await esbuild.build({
        entryPoints: [path.join(basePath, "src/index.ts")],
        outdir: path.join(basePath, "dist"),
        bundle: true,
        plugins: [
            stylePlugin({
                renderOptions: {
                    sassOptions: {
                        outputStyle: "compressed",
                    },
                },
            }),
        ],
    });
});
