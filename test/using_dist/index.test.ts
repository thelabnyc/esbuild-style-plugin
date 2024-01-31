import { execFileSync } from "child_process";
import "jest";
import path from "path";

const basePath = "./test/using_dist";

test("Using dist (cjs)", async () => {
    execFileSync("node", [path.join(basePath, "bundle.js")]);
});

test("Using dist (esm)", async () => {
    execFileSync("node", [path.join(basePath, "bundle.mjs")]);
});
