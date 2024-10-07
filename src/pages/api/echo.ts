import {type NextApiHandler, type NextApiRequest, type NextApiResponse} from 'next';

export const config = {
  api: {
    bodyParser: false,
  },
};

const allowCors = (fn: NextApiHandler) => async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  res.setHeader('Access-Control-Allow-Credentials', "true");
  res.setHeader('Access-Control-Allow-Origin', "*");
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  return await fn(req, res);
}

function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { method, url, headers, body } = req;

    res.status(200).json({
      method,
      url,
      headers,
      body,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong' });
  }
}


export default allowCors(handler);
