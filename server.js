import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { InferenceClient } from '@huggingface/inference';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

const hf = new InferenceClient(process.env.HUGGING_FACE_TOKEN);

// 1. Generate Image Endpoint
app.post('/api/generate-image', async (req, res) => {
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
    console.error('HF Error:', error);
    return res.status(500).json({ error: 'Failed to generate image' });
  }
});

// 2. Remove Background Endpoint
app.post('/api/remove-bg', async (req, res) => {
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
    console.error('Remove.bg Error:', error);
    return res.status(500).json({ error: 'Failed to remove background' });
  }
});

export default app;

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));
}