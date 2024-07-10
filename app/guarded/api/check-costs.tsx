import axios from 'axios';

export async function POST(request: { json: () => PromiseLike<{ origin: any; destination: any; weight: any; courier: any; }> | { origin: any; destination: any; weight: any; courier: any; }; }) {
  try {
    const { origin, destination, weight, courier } = await request.json();
    const response = await axios.post('https://api.rajaongkir.com/starter/cost', 
      {
        origin,
        destination,
        weight,
        courier
      },
      {
        headers: {
          'key': process.env.RAJAONGKIR_API_KEY
        }
      }
    );
    return new Response(JSON.stringify(response.data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to check costs' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export async function GET() {
  return new Response('Method Not Allowed', { status: 405 });
}