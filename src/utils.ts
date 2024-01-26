import path from "node:path";
import fs from "node:fs";
import { globSync } from "glob";
import sass from "sass";
import { AcceptedPlugin, Result } from "postcss";

type SassOptions = sass.LegacySharedOptions<"sync">;

export interface RenderOptions {
    sassOptions?: SassOptions;
}

export interface RenderResult {
    css: string;
    watchFiles: string[];
}

interface SourceMap {
    version: number;
    file: string;
    sourceRoot?: string;
    sources: string[];
    sourcesContent?: string[];
    names: string[];
    mappings: string;
}

const getWatchFilesFromSourceMap = (
    rootFile: string,
    sourceMap: SourceMap,
): string[] => {
    try {
        const baseDir = path.dirname(rootFile);
        const watchFiles: string[] = sourceMap.sources.map((srcFile) => {
            return path.resolve(baseDir, srcFile);
        });
        return watchFiles;
    } catch (e) {
        console.error(e);
        return [];
    }
};

const renderSass = async (
    filePath: string,
    options: SassOptions,
): Promise<RenderResult> => {
    const sassResult = sass.renderSync({
        ...options,
        file: filePath,
        // Force sourcemap to be enabled so that we can parse the file sources out of it
        sourceMap: `${filePath}.map`,
        sourceMapEmbed: false,
    });
    const sourceMap: SourceMap | null = sassResult.map
        ? JSON.parse(sassResult.map.toString())
        : null;
    return {
        css: sassResult.css.toString(),
        watchFiles: sourceMap
            ? getWatchFilesFromSourceMap(filePath, sourceMap)
            : [],
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
