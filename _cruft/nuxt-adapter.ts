// import type { Express, Request, Response } from "express";
import type { IncomingMessage, Server as HTTPServer } from "node:http";
import type { Server as HTTPSServer } from "node:https";
import type { Duplex } from "node:stream";

// import type { GrafservConfig, RequestDigest } from "../../../interfaces.js";
import type { GrafservConfig, RequestDigest } from "grafserv";
// import type { OptionsFromConfig } from "../../../options.js";
import type { OptionsFromConfig } from "grafserv";
// import {
//   getBodyFromFrameworkBody,
//   getBodyFromRequest,
//   processHeaders,
// } from "../../../utils.js";
// import {
//   getBodyFromFrameworkBody,
//   getBodyFromRequest,
//   processHeaders,
// } from "grafserv";
// import { NodeGrafservBase } from "../../node/index.js";
import { GrafservBase } from "grafserv";

declare global {
  namespace Grafast {
    interface RequestContext {
      expressv4: {
        req: Request;
        res: Response;
      };
    }
  }
}

export class Nuxt3Grafserv extends GrafservBase {
  protected getDigest(
    dynamicOptions: OptionsFromConfig,
    req: Request,
    res: Response,
  ): RequestDigest {
    return {
      httpVersionMajor: req.httpVersionMajor,
      httpVersionMinor: req.httpVersionMinor,
      isSecure: req.secure,
      method: req.method,
      path: req.path,
      headers: processHeaders(req.headers),
      getQueryParams() {
        return req.query as Record<string, string | string[]>;
      },
      getBody() {
        if (req.body != null) {
          return getBodyFromFrameworkBody(req.body);
        } else {
          return getBodyFromRequest(req, dynamicOptions.maxRequestLength);
        }
      },
      requestContext: {
        node: {
          req,
          res,
        },
        expressv4: {
          req,
          res,
        },
      },
    };
  }

  async addTo(
    app: Express,
    server: HTTPServer | HTTPSServer | null,
    addExclusiveWebsocketHandler = true,
  ) {
    app.use(this._createHandler());
    // Alias this just to make it easier for users to copy/paste the code below
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    // const serv = this;
    // if (addExclusiveWebsocketHandler) {
    //   const grafservUpgradeHandler = await serv.getUpgradeHandler();
    //   if (grafservUpgradeHandler) {
    //     const upgrade = (
    //       req: IncomingMessage,
    //       socket: Duplex,
    //       head: Buffer,
    //     ) => {
    //       if (serv.shouldHandleUpgrade(req, socket, head)) {
    //         grafservUpgradeHandler(req, socket, head);
    //       } else {
    //         socket.destroy();
    //       }
    //     };

    //     const attachWebsocketsToServer = (server: HTTPServer | HTTPSServer) => {
    //       server.on("upgrade", upgrade);
    //       serv.onRelease(() => {
    //         server.off("upgrade", upgrade);
    //       });
    //     };

    //     if (server) {
    //       // If user explicitly passes server, bind to it:
    //       attachWebsocketsToServer(server);
    //     } else {
    //       // If not, hope they're calling `app.listen()` and intercept that call.
    //       const oldListen = app.listen;
    //       app.listen = function (...args: any) {
    //         const server = oldListen.apply(this, args);
    //         attachWebsocketsToServer(server);
    //         return server;
    //       };
    //     }
    //   }
    // }
  }
}

export function grafserv(config: GrafservConfig) {
  return new Nuxt3Grafserv(config);
}

function processHeaders(
  headers: IncomingHttpHeaders,
): Record<string, string> {
  const headerDigest: Record<string, string> = Object.create(null);
  for (const key in headers) {
    const val = headers[key];
    if (val == null) {
      continue;
    }
    if (typeof val === "string") {
      headerDigest[key] = val;
    } else {
      headerDigest[key] = val.join("\n");
    }
  }
  return headerDigest;
}
