export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { image_b64 } = req.body || {};
    if (!image_b64) return res.status(400).json({ error: 'Image base64 is required' });

    const response = await fetch('https://api.remove.bg/v1.0/removebg', {
      method: 'POST',
      headers: {
        'X-Api-Key': process.env.REMOVE_BACKGROUND_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        image_file_b64: image_b64,
        size: 'auto',
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      return res.status(response.status).json({ error: errText });
    }

    const arrayBuffer = await response.arrayBuffer();
    res.setHeader('Content-Type', 'image/png');
    return res.status(200).send(Buffer.from(arrayBuffer));
  } catch (error) {
    console.error('Remove.bg Serverless Error:', error);
    return res.status(500).json({ error: 'Failed to remove background' });
  }
}