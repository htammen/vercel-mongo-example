import { NowRequest, NowResponse } from "@vercel/node";

export default (request: NowRequest, response: NowResponse) => {
  response.status(500).send(`env: ${process.env.MONGODB_URI}!`);
};
