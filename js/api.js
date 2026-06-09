const BASE_URL = "https://paginas-web-cr.com/Api/hotelApi/";

export async function consultarDatos(modulo) {
    const respuesta = await fetch(`${BASE_URL}${modulo}/${modulo}.php`);
    const datos = await respuesta.json();
    return datos;
}