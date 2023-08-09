import { PassThrough } from 'stream'
import { RequestDigest, processHeaders, GrafservBase, GrafservBody, GrafservConfig, normalizeRequest, convertHandlerResultToResult } from "postgraphile/grafserv"
import "postgraphile/grafserv/node"
import { H3Event } from 'h3'

type Result = Awaited<ReturnType<typeof convertHandlerResultToResult>>

declare global {
  namespace Grafast {
    interface RequestContext {
      nuxtv3: {
        event: H3Event;
      };
    }
  }
}

export function grafserv(config: GrafservConfig) {
  return new Nuxt3Grafserv(config);
}

export function getDigest(
  event: H3Event
): RequestDigest {
  const req = event.node.req
  const res = event.node.res
  return {      
    httpVersionMajor: req.httpVersionMajor,
    httpVersionMinor: req.httpVersionMinor,
    isSecure: getRequestProtocol(event) === 'https',
    method: getMethod(event),
    path: event.path,
    headers: processHeaders(getRequestHeaders(event)),
    getQueryParams() {
      return getQuery(event) as Record<string, string | string[]>;
    },
    async getBody() {
      const body = await readBody(event)
      return getBodyFromFrameworkBody(body)
    },
    requestContext: {
      nuxtv3: {
        event
      },
      node: {
        req,
        res,
      },
    },
  };
}

export function getBodyFromFrameworkBody(body: unknown): GrafservBody {
  if (typeof body === "string") {
    return {
      type: "text",
      text: body,
    };
  } else if (Buffer.isBuffer(body)) {
    return {
      type: "buffer",
      buffer: body,
    };
  } else if (typeof body === "object" && body != null) {
    return {
      type: "json",
      json: body as any,
    };
  } else {
    throw new Error(
      `Grafserv Express adaptor doesn't know how to interpret this request body`,
    );
  }
}

export class Nuxt3Grafserv extends GrafservBase {
  public async handleEvent(event: H3Event) {
    const digest = getDigest(event);

    const handlerResult = await this.graphqlHandler(
      normalizeRequest(digest),
      this.graphiqlHandler,
    );
    const result = await convertHandlerResultToResult(handlerResult);
    return this.send(event, result);
  }

  public async send(
    event: H3Event,
    result: Result | null,
  ) {
    if (result === null) {
      // 404
      setResponseStatus(event, 404);
      return "¯\\_(ツ)_/¯";
    }

    switch (result.type) {
      case "error": {
        const { statusCode, headers } = result;
        setResponseHeaders(event, headers)
        setResponseStatus(event, statusCode);
        // DEBT: mutating the error is probably bad form...
        const errorWithStatus = Object.assign(result.error, {
          status: statusCode,
        });
        throw errorWithStatus;
      }
      case "buffer": {
        const { statusCode, headers, buffer } = result;
        setResponseHeaders(event, headers)
        setResponseStatus(event, statusCode);
        return buffer;
      }
      case "json": {
        const { statusCode, headers, json } = result;
        setResponseHeaders(event, headers)
        setResponseStatus(event, statusCode);
        return json;
      }
      case "noContent": {
        const { statusCode, headers } = result;
        setResponseHeaders(event, headers)
        setResponseStatus(event, statusCode);
        return null;
      }
      case "bufferStream": {
        const { statusCode, headers, lowLatency, bufferIterator } = result;
        let bufferIteratorHandled = false;
        try {
          // if (lowLatency) {
          //   request.raw.socket.setTimeout(0);
          //   request.raw.socket.setNoDelay(true);
          //   request.raw.socket.setKeepAlive(true);
          // }
          setResponseHeaders(event, headers)
          setResponseStatus(event, statusCode);
          const stream = new PassThrough();
          sendStream(event, stream).catch(e => {
            console.error('STREAMING PROBLEM', e)
          })

          // Fork off and convert bufferIterator to
          try {
            bufferIteratorHandled = true;
            for await (const buffer of bufferIterator) {
              stream.write(buffer);
            }
          } finally {
            stream.end();
          }
        } catch (e) {
          if (!bufferIteratorHandled) {
            try {
              if (bufferIterator.return) {
                bufferIterator.return();
              } else if (bufferIterator.throw) {
                bufferIterator.throw(e);
              }
            } catch (e2) {
              /* nom nom nom */
            }
          }
          throw e;
        }

        return;
      }
      default: {
        const never: never = result;
        console.log("Unhandled:");
        console.dir(never);
        setResponseHeader(event, 'content-type', 'text/plain')
        setResponseStatus(event, 503)
        return "Server hasn't implemented this yet";
      }
    }
  }
}
