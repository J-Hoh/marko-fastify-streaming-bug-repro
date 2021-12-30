# @marko/fastify streaming bug fix

This repo contains a proposed fix to the way the @marko/fastify plugin handles streaming.
Currently the stream would only be sent as soon as the stream ends. This causes <await(promise)> tags to NOT render, and get sorted later on. The server has to render the entire page, even if client-reorder is set to true.

___

## Getting Started

```bash
npm i
```

## Running the different versions:

Express, working as intended
```bash
npm dev:express
```

Fastify, using the existing, bugged, way of streaming. The page will load longer, and the promise will already be fullfilled.
```bash
npm dev:fastify
```

Fastify, using my proposed fix
```bash
npm dev:fastify:fixed
```
