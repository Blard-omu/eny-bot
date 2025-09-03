// import { pathsToModuleNameMapper } from 'ts-jest';
// import { compilerOptions } from '../tsconfig.json';


// /** @type {import('ts-jest').JestConfigWithTsJest} */
// const config = {
//   preset: 'ts-jest',
//   testEnvironment: 'node',
//   setupFilesAfterEnv: ['<rootDir>/__test__/config.ts'],
//   globals: {
//     'ts-jest': {
//       tsconfig: './tsconfig.json',
//     },
//   },
//   moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
//     prefix: '<rootDir>/',
//   }),
//   testMatch: ['**/__test__/**/*.test.ts'],
//   moduleFileExtensions: ['ts', 'js', 'json'],
//   verbose: true,
// };

// export default config;

import { pathsToModuleNameMapper } from 'ts-jest';
import { compilerOptions } from '../tsconfig.json';


/** @type {import('ts-jest').JestConfigWithTsJest} */
const config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: '<rootDir>/',
  }),
  testMatch: ['**/__test__/**/*.test.ts'],
  moduleFileExtensions: ['ts', 'js', 'json'],
  verbose: true,
};

export default config;