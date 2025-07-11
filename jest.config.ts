export default {
  compilerOptions: {
    jsx: "react-jsx",
    module: "esnext",
    target: "es6",
    moduleResolution: "node",
    strict: true,
    esModuleInterop: true,
    allowSyntheticDefaultImports: true,
    resolveJsonModule: true,
    isolatedModules: true,
    noEmit: true,
    types: ["jest", "node"],
    baseUrl: ".",
    paths: {
      "@/*": ["src/*"],
    },
  },
  include: ["src", "jest.setup.ts"],
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest", // <-- ts-jest handles JSX & TS
  },
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
  },
  testEnvironment: "jsdom",
};
