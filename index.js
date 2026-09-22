const BOT_TOKEN = "8993813132:AAFZq96jeMsIZp--VEsxYhuo6e9bdOkwu0I";

const DB_URL = "https://raw.githubusercontent.com/TU_USUARIO/TU_REPOSITORIO/main/peliculas.json";


export default {

async fetch(request) {

    const url = new URL(request.url);

    // prueba del worker
    if (url.pathname === "/") {
        return new Response(
            "Worker Telegram Video funcionando ✅"
        );
    }


    // formato:
    // /video/1

    let partes = url.pathname.split("/");


    if (partes[1] !== "video") {

        return new Response(
            "Ruta incorrecta. Usa /video/id",
            {status:404}
        );

    }


    let id = Number(partes[2]);


    // leer catálogo desde Github

    let respuesta = await fetch(DB_URL);

    let peliculas = await respuesta.json();


    let pelicula = peliculas.find(
        p => p.id === id
    );


    if (!pelicula) {

        return new Response(
            "Película no encontrada",
            {status:404}
        );

    }



    // pedir ruta real a Telegram

    let telegramAPI =
    `https://api.telegram.org/bot${BOT_TOKEN}/getFile?file_id=${pelicula.file_id}`;


    let resultado = await fetch(telegramAPI);

    let datos = await resultado.json();



    if (!datos.ok) {

        return new Response(
            "Error obteniendo archivo de Telegram",
            {status:500}
        );

    }



    let filePath = datos.result.file_path;



    let videoURL =
    `https://api.telegram.org/file/bot${BOT_TOKEN}/${filePath}`;



    // devolver enlace al reproductor

    return Response.redirect(videoURL,302);


}

}
