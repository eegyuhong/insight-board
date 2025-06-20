// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import 'jsr:@supabase/functions-js/edge-runtime.d.ts';

Deno.serve(async (req) => {
  const allowedOrigins = [
    'https://test-product-crawler-production-5e1b.up.railway.app',
    'https://eegyuhongs.vercel.app',
    'https://react-disney-plus-113f9.web.app',
    'https://eegyuhong.github.io/react-tictactoe',
    'https://vanilla-movie-ts.vercel.app',
    'https://elegant-tapioca-a44bc7.netlify.app',
    'https://vanilla-apple-ipad.vercel.app',
  ];
  const origin = req.headers.get('origin') || '';
  const isAllowedOrigin = allowedOrigins.includes(origin);

  // 모든 응답에 공통으로 들어갈 CORS 헤더
  const corsHeaders = {
    'Access-Control-Allow-Origin': isAllowedOrigin ? origin : '',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

  // OPTIONS 요청 처리 (CORS preflight)
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  try {
    const { SUPABASE_URL, SUPABASE_ANON_KEY } = Deno.env.toObject();

    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      return new Response(JSON.stringify({ error: 'Missing env vars' }), {
        status: 500,
        headers: corsHeaders,
      });
    }

    const body = await req.json();

    const {
      project,
      url,
      referrer,
      user_agent,
      screen_width,
      screen_height,
      session_id,
      stay_duration,
      timestamp,
    } = body;

    // 유효성 검사
    if (!project || !url || !session_id) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: corsHeaders,
      });
    }

    const { createClient } = await import('https://esm.sh/@supabase/supabase-js');
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    const { error } = await supabase.from('visit_logs').insert([
      {
        project,
        url,
        referrer,
        user_agent,
        screen_width,
        screen_height,
        session_id,
        stay_duration,
        created_at: timestamp || new Date().toISOString(),
      },
    ]);

    if (error) {
      console.error('❌ Supabase insert error:', error.message);
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: corsHeaders,
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
      },
    });
  } catch (err) {
    console.error('❌ Unexpected error:', err);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: corsHeaders,
    });
  }
});
