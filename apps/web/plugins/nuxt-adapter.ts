import { GrafservBase, GrafservConfig } from "postgraphile/grafserv";
import { NuxtApp } from "nuxt/schema";

export class NuxtGrafserv extends GrafservBase {
  constructor(config: GrafservConfig) {
    super(config);
  }

  async addTo(app: NuxtApp) {
    // // application/graphql-request+json isn't currently an official serialization format:
    // // https://graphql.github.io/graphql-over-http/draft/#sec-Media-Types
    // /*
    // app.addContentTypeParser(
    //   "application/graphql-request+json",
    //   { parseAs: "string" },
    //   app.getDefaultJsonParser("ignore", "ignore"),
    // );
    // */

    const dynamicOptions = this.dynamicOptions;

    for (const p in app.vueApp) {
      console.log(p)
    }

    app.vueApp.use('/tacos', (req, res) => {
      res.send('tacos')
    })

    // app.route({
    //   method:
    //     this.dynamicOptions.graphqlOverGET ||
    //     this.dynamicOptions.graphiqlOnGraphQLGET
    //       ? ["GET", "POST"]
    //       : ["POST"],
    //   url: this.dynamicOptions.graphqlPath,
    //   exposeHeadRoute: true,
    //   bodyLimit: this.dynamicOptions.maxRequestLength,
    //   handler: async (request, reply) => {
    //     const digest = getDigest(request, reply);
    //     const handlerResult = await this.graphqlHandler(
    //       normalizeRequest(digest),
    //       this.graphiqlHandler,
    //     );
    //     const result = await convertHandlerResultToResult(handlerResult);
    //     return this.send(request, reply, result);
    //   },
    //   ...(this.resolvedPreset.grafserv?.websockets
    //     ? {
    //         wsHandler: makeHandler(makeGraphQLWSConfig(this)),
    //       }
    //     : null),
    // });

    // if (dynamicOptions.graphiql) {
    //   app.route({
    //     method: "GET",
    //     url: this.dynamicOptions.graphiqlPath,
    //     exposeHeadRoute: true,
    //     bodyLimit: this.dynamicOptions.maxRequestLength,
    //     handler: async (request, reply) => {
    //       const digest = getDigest(request, reply);
    //       const handlerResult = await this.graphiqlHandler(
    //         normalizeRequest(digest),
    //       );
    //       const result = await convertHandlerResultToResult(handlerResult);
    //       return this.send(request, reply, result);
    //     },
    //   });
    // }

    // if (dynamicOptions.watch) {
    //   app.route({
    //     method: "GET",
    //     url: this.dynamicOptions.eventStreamPath,
    //     exposeHeadRoute: true,
    //     bodyLimit: this.dynamicOptions.maxRequestLength,
    //     handler: async (request, reply) => {
    //       const digest = getDigest(request, reply);
    //       // TODO: refactor this to use the eventStreamHandler once we write that...
    //       const handlerResult: EventStreamHeandlerResult = {
    //         type: "event-stream",
    //         request: normalizeRequest(digest),
    //         dynamicOptions,
    //         payload: this.makeStream(),
    //         statusCode: 200,
    //       };
    //       const result = await convertHandlerResultToResult(handlerResult);
    //       return this.send(request, reply, result);
    //     },
    //   });
    // }
  }
}

export function grafserv(config: GrafservConfig) {
  return new NuxtGrafserv(config);
}