import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['src/index.ts', 'src/server/index.ts'],
  format: ['esm'],
  dts: {
    resolve: true,
  },
  splitting: false,
  sourcemap: true,
  clean: true,
  treeshake: true,
  outDir: 'dist',
  tsconfig: './tsconfig.json',
})

