"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ts_jest_1 = require("ts-jest");
const tsconfig_json_1 = require("../tsconfig.json");
/** @type {import('ts-jest').JestConfigWithTsJest} */
const config = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    moduleNameMapper: (0, ts_jest_1.pathsToModuleNameMapper)(tsconfig_json_1.compilerOptions.paths, {
        prefix: '<rootDir>/',
    }),
    testMatch: ['**/__test__/**/*.test.ts'],
    moduleFileExtensions: ['ts', 'js', 'json'],
    verbose: true,
};
exports.default = config;
