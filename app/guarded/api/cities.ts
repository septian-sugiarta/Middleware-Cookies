import axios from 'axios';

export async function GET() {
  try {
    const response = await axios.get('https://api.rajaongkir.com/starter/city', {
      headers: {
        'key': process.env.RAJAONGKIR_API_KEY
      }
    });
    return new Response(JSON.stringify(response.data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to fetch cities' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export async function POST() {
  return new Response('Method Not Allowed', { status: 405 });
}