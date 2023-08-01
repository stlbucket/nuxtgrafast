import { grafserv } from "grafserv/express/v4";
import preset from "./graphile.config.js";
import { postgraphile } from "postgraphile"

const pgl = postgraphile(preset);
const serv = pgl.createServ(grafserv);
const handler = serv.createHandler();

export default fromNodeMiddleware(handler)

// export default eventHandler((event) => {
//   handler(event.node.req, event.node.res);
// })
