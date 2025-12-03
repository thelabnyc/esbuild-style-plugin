import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { globSync } from "glob";
import { AcceptedPlugin, Result } from "postcss";
import sass from "sass";

type SassOptions = sass.Options<"sync">;

export interface RenderOptions {
    sassOptions?: SassOptions;
}

export interface RenderResult {
    css: string;
    watchFiles: string[];
}

const renderSass = async (
    filePath: string,
    options: SassOptions,
): Promise<RenderResult> => {
    const sassResult = sass.compile(filePath, {
        ...options,
        // Always enable sourceMap to track loaded files for watch mode
        sourceMap: true,
    });

    // Extract watch files from loadedUrls
    const watchFiles = sassResult.loadedUrls
        .filter((url) => url.protocol === "file:")
        .map((url) => fileURLToPath(url));

    return {
        css: sassResult.css,
        watchFiles,
    };
};

export const renderStyle = async (
    filePath: string,
    options: RenderOptions = {},
): Promise<RenderResult> => {
    const { ext } = path.parse(filePath);

    if (ext === ".css") {
        return {
            css: (await fs.promises.readFile(filePath)).toString(),
            watchFiles: [],
        };
    }

    if (ext === ".sass" || ext === ".scss") {
        const sassOptions = options.sassOptions || {};
        return renderSass(filePath, sassOptions);
    }

    throw new Error(`Can't render this style '${ext}'.`);
};

export const getPostCSSWatchFiles = (result: Result) => {
    let watchFiles = [] as string[];
    const { messages } = result;
    for (const message of messages) {
        const { type } = message;
        if (type === "dependency") {
            watchFiles.push(message.file);
        } else if (type === "dir-dependency") {
            if (!message.dir) continue;

            // Can be translated to const globString = message.glob ?? `**/*` but we will use code bellow to support node12
            // https://node.green/#ES2020-features--nullish-coalescing-operator-----
            let globString = `**/*`;
            if (message.glob && message.glob !== "") globString = message.glob;

            const globPath = path.join(message.dir, globString);
            const files = globSync(globPath);
            watchFiles = [...watchFiles, ...files];
        }
    }
    return watchFiles;
};
