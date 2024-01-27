import * as esbuild from "esbuild";
import "jest";
import path from "path";

import stylePlugin from "../../src/index";

const basePath = "./test/preprocessors";

test("Test preprocessors", async () => {
    await esbuild.build({
        entryPoints: [path.join(basePath, "src/index.ts")],
        outdir: path.join(basePath, "dist"),
        bundle: true,
        plugins: [stylePlugin()],
    });
});
