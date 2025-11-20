// supabase/functions/moderate-post/index.ts

import { serve } from "https://deno.land/std/http/server.ts";

const BAD_WORDS = ["spam", "scam", "fake", "badword", "misinformation"];

function moderate(text: string) {
  const lower = text.toLowerCase();
  return BAD_WORDS.some(word => lower.includes(word));
}

serve(async (req: Request) => {
  try {
    const { title = "", content = "" } = await req.json();

    const flagged = moderate(title + " " + content);

    return new Response(
      JSON.stringify({ flagged }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
});
