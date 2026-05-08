import axios from 'axios';

const AI_TOKEN = import.meta.env.VITE_AI_TOKEN;

// Spaceflight News API (Free, no key required)
const newsApi = axios.create({
  baseURL: 'https://api.spaceflightnewsapi.net/v4',
});

export const fetchNews = async () => {
  try {
    const response = await newsApi.get('/articles/', {
      params: {
        limit: 10,
        ordering: '-published_at'
      },
    });
    return response.data.results.map(article => ({
      title: article.title,
      description: article.summary,
      url: article.url,
      urlToImage: article.image_url,
      publishedAt: article.published_at,
      source: { name: article.news_site }
    }));
  } catch (error) {
    console.error('Error fetching news:', error);
    throw error;
  }
};

export const fetchISSLocation = async () => {
  // WheretheISS is reliable but has a rate limit of 1/sec. 
  // We use 20s interval in our hook to stay well within limits.
  const response = await axios.get('https://api.wheretheiss.at/v1/satellites/25544');
  return {
    latitude: parseFloat(response.data.latitude),
    longitude: parseFloat(response.data.longitude),
    timestamp: response.data.timestamp
  };
};

export const fetchAstronauts = async () => {
  // Using a more reliable proxy for OpenNotify
  try {
    const response = await axios.get('https://api.allorigins.win/raw?url=http://api.open-notify.org/astros.json');
    return response.data.people;
  } catch (err) {
    // Fallback if proxy fails
    return [
      { name: "Oleg Kononenko", craft: "ISS" },
      { name: "Nikolai Chub", craft: "ISS" },
      { name: "Tracy Caldwell Dyson", craft: "ISS" }
    ];
  }
};

export const chatWithAI = async (message, context) => {
  try {
    const response = await axios.post(
      'https://router.huggingface.co/v1/chat/completions',
      {
        model: "Qwen/Qwen3-1.7B:featherless-ai",
        messages: [
          {
            role: "system",
            content: `You are a helpful assistant for the Orbit News AI Dashboard. 
            Use the following dashboard data to answer the user's question. 
            If the question is not about the dashboard data (ISS, News, Astronauts), politely inform the user that you can only discuss dashboard-related information.
            
            Dashboard Data:
            ${JSON.stringify(context)}`
          },
          {
            role: "user",
            content: message
          }
        ],
        max_tokens: 1024,
      },
      {
        headers: {
          Authorization: `Bearer ${AI_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );
    
    const choice = response.data.choices[0].message;
    return (choice.content || choice.reasoning || "I processed your request but couldn't generate a visible response. Please try again.").trim();
  } catch (error) {
    console.error('AI Chat Error:', error);
    return "I'm sorry, I'm having trouble connecting to my brain right now. Please try again later.";
  }
};
