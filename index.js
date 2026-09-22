export default {
  async fetch(request, env) {

    const url = new URL(request.url);

    if (url.pathname.startsWith("/video/")) {

      const fileId = url.pathname.split("/video/")[1];

      if (!fileId) {
        return new Response("Falta file_id", {status:400});
      }

      const telegram = await fetch(
        `https://api.telegram.org/bot${env.BOT_TOKEN}/getFile?file_id=${fileId}`
      );

      const data = await telegram.json();

      if (!data.ok) {
 return new Response(
 JSON.stringify(data),
 {
  status:500,
  headers:{
   "content-type":"application/json"
  }
 }
 );
}

      const filePath = data.result.file_path;

      const videoUrl =
      `https://api.telegram.org/file/bot${env.BOT_TOKEN}/${filePath}`;

      return Response.redirect(videoUrl,302);
    }


    return new Response(
      "Worker Telegram Video funcionando ✅"
    );
  }
}
