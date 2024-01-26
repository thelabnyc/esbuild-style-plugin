import { JestConfigWithTsJest } from "ts-jest";

const config: JestConfigWithTsJest = {
    preset: "ts-jest",
    roots: ["test"],
    testEnvironment: "node",
};

export default config;
