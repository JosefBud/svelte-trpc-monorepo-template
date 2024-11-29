import * as Schema from "@effect/schema/Schema";
import { Context, Layer, Effect } from "effect";
import express from "express";
import { initTRPC } from "@trpc/server";
import * as trpcExpress from "@trpc/server/adapters/express";

/**
 * Initialization of tRPC backend
 * Should be done only once per backend!
 */
const t = initTRPC.create();

/**
 * Export reusable router and procedure helpers
 * that can be used throughout the router
 */
export const baseRouter = t.router;
export const publicProcedure = t.procedure;

const router = baseRouter({
  hello: publicProcedure
    .input(Schema.decodeUnknownSync(Schema.Struct({ name: Schema.String })))
    .output(
      Schema.decodeUnknownSync(Schema.Struct({ greeting: Schema.String })),
    )
    // .meta({ openapi: { method: 'GET', path: '/say-hello' } })
    .query(async ({ input }) => {
      // Retrieve users from a datasource, this is an imaginary database
      return {
        greeting: `hello ${input.name}
        `,
      };
    }),
});

// Export type router type signature,
// NOT the router itself.
export type AppRouter = typeof router;

class Express extends Context.Tag("Express")<
  Express,
  ReturnType<typeof express>
>() {}

const createContext = ({
  req,
  res,
}: trpcExpress.CreateExpressContextOptions) => ({}); // no context
type Context = Awaited<ReturnType<typeof createContext>>;

const TrpcMiddlewareLive = Layer.effectDiscard(
  Effect.gen(function* () {
    const app = yield* Express;
    app.use(
      "/trpc",
      trpcExpress.createExpressMiddleware({ router, createContext }),
    );
  }),
);

// Server Setup
const ServerLive = Layer.scopedDiscard(
  Effect.gen(function* () {
    const port = 3001;
    const app = yield* Express;
    yield* Effect.acquireRelease(
      Effect.sync(() =>
        app.listen(port, () =>
          console.log(`Example app listening on port ${port}`),
        ),
      ),
      (server) => Effect.sync(() => server.close()),
    );
  }),
);

// Setting Up Express
const ExpressLive = Layer.sync(Express, () => express());

// Combine the layers
const AppLive = ServerLive.pipe(
  Layer.provide(TrpcMiddlewareLive),
  Layer.provide(ExpressLive),
);

// Run the program
Effect.runFork(Layer.launch(AppLive));
