# svelte-trpc-monorepo

A template for a Bun-driven monorepo w/ [Svelte](https://svelte.dev/) on the front end, and [tRPC](https://trpc.io/) w/ [Effect](https://effect.website/) on the back end.

## Prerequisites
- [Bun](https://bun.sh/)
  - or `npm`, `pnpm`, or `yarn` if you prefer, just delete the Bun lockfile

## To install dependencies:

```bash
bun install
```

## Getting started:

The `start:dev` script at the root will run the `start:dev` scripts in each package.  

```bash
bun start:dev
```

That script is really just using [`nx`](https://nx.dev/) under the hood.
To run a script in one of the apps, individually, use `nx`:

```bash
# Examples
nx start:dev api
nx start:dev web
nx build api
nx build web
```