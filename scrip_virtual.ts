import OpenAI from 'openai';
import axios from 'axios';

const apiKey = 'mi-key';

const openai = new OpenAI({
  apiKey: apiKey,
});

async function fetchAuditOptions() {
  try {
    const response = await axios.get('https://bpm-backend.onrender.com/accion-correctivas');
    return response.data;
  } catch (error) {
    console.error('Error fetching audit options:', error);
    throw error;
  }
}

async function chatWithGPT(message: string) {
  try {
    // Obtener los datos de la API externa
    const auditOptions = await fetchAuditOptions();

    // Construir el mensaje con la data obtenida
    const enrichedMessage = `${message} Aquí están las opciones de acción correctiva disponibles: ${JSON.stringify(auditOptions)}`;

    // Enviar el mensaje a ChatGPT
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: enrichedMessage }],
    });

    const reply = response.choices[0].message?.content || '';
    console.log('ChatGPT:', reply);
    return reply;
  } catch (error) {
    console.error('Error interacting with ChatGPT API:', error);
    throw error;
  }
}

// Uso
chatWithGPT('Necesito ayuda con las acciones correctivas para la auditoría.')
  .then(reply => console.log('Respuesta de ChatGPT:', reply))
  .catch(error => console.error('Error:', error));
