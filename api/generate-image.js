import { InferenceClient } from '@huggingface/inference';

const hf = new InferenceClient(process.env.HUGGING_FACE_TOKEN);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { prompt, model, prefix } = req.body || {};
    if (!prompt) return res.status(400).json({ error: 'Prompt is required' });

    const finalPrompt = prefix ? `${prompt}, ${prefix}` : prompt;
    const responseBlob = await hf.textToImage({
      model: model || 'black-forest-labs/FLUX.1-schnell',
      inputs: finalPrompt,
    });

    const arrayBuffer = await responseBlob.arrayBuffer();
    res.setHeader('Content-Type', 'image/png');
    return res.status(200).send(Buffer.from(arrayBuffer));
  } catch (error) {
    console.error('HF Serverless Error:', error);
    return res.status(500).json({ error: 'Failed to generate image' });
  }
}