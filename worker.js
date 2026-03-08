export default {
  async fetch(request, env) {
    const cors = {'Access-Control-Allow-Origin':'*','Content-Type':'application/json'};
    if (request.method === 'OPTIONS') return new Response(null, {headers: cors});
    try {
      const res = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=' + env.GEMINI_KEY, {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({
          contents: [{parts: [{text: 'You are a geopolitical analyst. Search for latest Middle East news today. Analyze who has the military and diplomatic upper hand: Iran axis (Iran, Hezbollah, Houthis, Iraqi factions) vs USA-Israel axis (USA, Israel, UK, Saudi Arabia, UAE). Return ONLY valid JSON, no markdown, no backticks: {"iran_pct":42,"usa_pct":58,"tension_pct":82,"tension_label":"High","tension_status":"Active Escalation","iran_caps":{"air":52,"missiles":78,"drones":70,"naval":45,"nuclear":60,"economy":30},"usa_caps":{"air":94,"missiles":88,"drones":85,"naval":96,"nuclear":99,"economy":92},"iran_events":[{"time":"12:00","type":"strike","text":"event from news"},{"time":"10:00","type":"drone","text":"event from news"}],"usa_events":[{"time":"11:00","type":"naval","text":"event from news"},{"time":"09:00","type":"diplo","text":"event from news"}],"fronts":{"gaza":"ongoing war","lebanon":"intermittent tension","yemen":"naval attacks","iran":"on alert","iraq":"active factions"},"hormuz":"open","mandab":"threatened","ticker":["news1","news2","news3"],"summary":"analytical summary"} Rules: iran_pct+usa_pct=100, all values 0-100, JSON only'}]}],
          tools: [{google_search: {}}],
          generationConfig: {maxOutputTokens: 1500}
        })
      });
      const data = await res.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
      const s = text.indexOf('{'), e = text.lastIndexOf('}');
      return new Response(text.slice(s, e+1), {headers: cors});
    } catch(err) {
      return new Response('{"error":"'+err.message+'"}', {status:500, headers: cors});
    }
  }
};
