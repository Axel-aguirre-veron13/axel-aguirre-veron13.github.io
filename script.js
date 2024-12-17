const API = {
    ALIMENTOS: 'https://world.openfoodfacts.org/cgi/search.pl',
    NUTRICION: 'https://trackapi.nutritionix.com/v2/natural/nutrients',
    CABECERAS: {
        'Content-Type': 'application/json',
        'x-app-id': '21d107dd',
        'x-app-key': '3afb903e0cc45f8816f52bfd8c593d2c',
        'x-remote-user-id': '0'
    }
};

const EMOJIS_NUTRIENTES = {
    calorias: '🔥',
    proteinas: '🥩',
    carbohidratos: '🌾',
    grasas: '🥑',
    grasasSaturadas: '🥓',
    fibra: '🌿',
    azucar: '🍯',
    sodio: '🧂'
};

let todosLosAlimentos = [];
let alimentosSeleccionados = [];

let datosUsuario = {
    tmb: 0,
    objetivo: 'mantener'
};

document.addEventListener('DOMContentLoaded', function() {
    // Ocultar secciones de búsqueda de alimentos y comidas al cargar la página
    document.getElementById('seccionProductos').style.display = 'none';
    document.getElementById('seccionComidas').style.display = 'none';
    document.getElementById('seccionSeleccionados').style.display = 'none';
    document.getElementById('alimentosSeleccionados').style.display = 'none'; // Ocultar sección de alimentos seleccionados

    const infoIcon = document.querySelector('.info-icon');

    infoIcon.addEventListener('mouseover', function() {
        // Mostrar un tooltip o un mensaje
        alert("Sedentario: poco o ningún ejercicio. \nLigera actividad: ejercicio ligero 1-3 días a la semana. \nActividad moderada: ejercicio moderado 3-5 días a la semana. \nActividad intensa: ejercicio intenso 5-6 días a la semana. \nActividad muy intensa: ejercicio físico diario o trabajo físico.");
    });

    infoIcon.addEventListener('click', function() {
        // Mostrar un tooltip o un mensaje
        alert("Sedentario: poco o ningún ejercicio. \nLigera actividad: ejercicio ligero 1-3 días a la semana. \nActividad moderada: ejercicio moderado 3-5 días a la semana. \nActividad intensa: ejercicio intenso 5-6 días a la semana. \nActividad muy intensa: ejercicio físico diario o trabajo físico.");
    });

    document.getElementById('copiarDatos').addEventListener('click', function() {
        const edad = document.getElementById('edad').value;
        const sexo = document.getElementById('sexo').value;
        const peso = document.getElementById('peso').value;
        const altura = document.getElementById('altura').value;
        const actividad = document.getElementById('actividad').value;
        const tmb = datosUsuario.tmb;

        // Descripción del nivel de actividad
        let descripcionActividad;
        switch (actividad) {
            case "1.2":
                descripcionActividad = "Sedentario: poco o ningún ejercicio.";
                break;
            case "1.375":
                descripcionActividad = "Ligera actividad: ejercicio ligero 1-3 días a la semana.";
                break;
            case "1.55":
                descripcionActividad = "Actividad moderada: ejercicio moderado 3-5 días a la semana.";
                break;
            case "1.725":
                descripcionActividad = "Actividad intensa: ejercicio intenso 6-7 días a la semana.";
                break;
            case "1.9":
                descripcionActividad = "Actividad muy intensa: ejercicio físico diario o trabajo físico.";
                break;
            default:
                descripcionActividad = "Nivel de actividad no especificado.";
        }

        // Crear un texto con todos los datos
        const datos = `
            Edad: ${edad}
            Sexo: ${sexo}
            Peso: ${peso} kg
            Altura: ${altura} cm
            Nivel de Actividad: ${descripcionActividad}
            TMB: ${Math.round(tmb)} kcal
            Desayuno: 
            Almuerzo:
            Postre:
            Merienda:
            Cena:
            Objetivo de la Dieta:
        `;

        // Copiar al portapapeles
        navigator.clipboard.writeText(datos).then(() => {
            alert('Datos copiados al portapapeles!');
        }).catch(err => {
            console.error('Error al copiar: ', err);
        });
    });
});

function calcularTMB() {
    const edad = parseInt(document.getElementById('edad').value);
    const sexo = document.getElementById('sexo').value;
    const peso = parseFloat(document.getElementById('peso').value);
    const altura = parseInt(document.getElementById('altura').value);
    const actividad = parseFloat(document.getElementById('actividad').value);

    if (!edad || !peso || !altura) {
        alert('Por favor, completa todos los campos');
        return;
    }

    // Fórmula de Benedict-Harris
    let tmb;
    if (sexo === 'hombre') {
        tmb = 66.473 + (13.751 * peso) + (5.0033 * altura) - (6.755 * edad);
    } else {
        tmb = 655.0955 + (9.463 * peso) + (1.8496 * altura) - (4.6756 * edad);
    }

    // Ajuste por nivel de actividad
    const caloriasDiarias = tmb * actividad;
    datosUsuario.tmb = caloriasDiarias;

    // Mostrar resultados
    const resultadoDiv = document.getElementById('resultadoTMB');
    resultadoDiv.innerHTML = `
        <h3>📊 Resultados del Cálculo</h3>
        <div class="tmb-detalle">
            <div class="tmb-item">
                <strong>TMB Base</strong>
                <p>${Math.round(tmb)} kcal</p>
            </div>
            <div class="tmb-item">
                <strong>Calorías Diarias</strong>
                <p>${Math.round(caloriasDiarias)} kcal</p>
            </div>
            <div class="tmb-item">
                <strong>Para Adelgazar</strong>
                <p>${Math.round(caloriasDiarias - 500)} kcal</p>
            </div>
            <div class="tmb-item">
                <strong>Para Aumentar</strong>
                <p>${Math.round(caloriasDiarias + 500)} kcal</p>
            </div>
        </div>
    `;

    // Ocultar secciones de búsqueda de alimentos y comidas después de calcular TMB
    document.getElementById('seccionProductos').style.display = 'none';
    document.getElementById('seccionComidas').style.display = 'none';
    document.getElementById('seccionSeleccionados').style.display = 'none';
    document.getElementById('alimentosSeleccionados').style.display = 'none'; // Ocultar sección de alimentos seleccionados
}

function cambiarTab(tab) {
    document.querySelectorAll('.tab').forEach(t => 
        t.classList.remove('activo'));
    document.querySelector(`.tab[onclick*="${tab}"]`)
        .classList.add('activo');

    // Ocultar todas las secciones
    document.getElementById('seccionInformacion').style.display = 'none'; // Ocultar sección de Información Personal
    document.getElementById('seccionProductos').style.display = 'none';
    document.getElementById('seccionComidas').style.display = 'none';
    document.getElementById('seccionSeleccionados').style.display = 'none';
    document.getElementById('seccionChatBot').style.display = 'none'; // Ocultar sección del Chat Bot

    // Mostrar la sección correspondiente con animación
    if (tab === 'informacion') {
        const informacion = document.getElementById('seccionInformacion');
        informacion.style.display = 'block';
        informacion.classList.add('animated'); // Agregar clase de animación
    } else if (tab === 'seleccionados') {
        const seleccionados = document.getElementById('seccionSeleccionados');
        seleccionados.style.display = 'block';
        seleccionados.classList.add('animated'); // Agregar clase de animación
        mostrarAlimentosSeleccionados();
    } else if (tab === 'productos') {
        const productos = document.getElementById('seccionProductos');
        productos.style.display = 'block';
        productos.classList.add('animated'); // Agregar clase de animación
    } else if (tab === 'comidas') {
        const comidas = document.getElementById('seccionComidas');
        comidas.style.display = 'block';
        comidas.classList.add('animated'); // Agregar clase de animación
    } else if (tab === 'chatbot') {
        const chatbot = document.getElementById('seccionChatBot');
        chatbot.style.display = 'block'; // Mostrar sección del Chat Bot
        chatbot.classList.add('animated'); // Agregar clase de animación
    }

    tabActivo = tab;
}

function mostrarAlimentosSeleccionados() {
    const listaAlimentosSeleccionados = document.getElementById('listaAlimentosSeleccionados');
    let html = '<h3>🛒 Alimentos Seleccionados</h3>';
    let caloriasTotales = 0; // Variable para acumular las calorías totales

    if (todosLosAlimentos.length === 0) {
        html += '<p>No hay alimentos seleccionados</p>';
    } else {
        todosLosAlimentos.forEach((alimento, indice) => {
            const caloriasAlimento = Math.round(alimento.nutrientes.calorias * alimento.cantidad / 100);
            caloriasTotales += caloriasAlimento; // Sumar las calorías de cada alimento
            html += `
                <div class="tarjeta-alimento-seleccionado">
                    ${alimento.urlImagen ? 
                        `<img src="${alimento.urlImagen}" alt="${alimento.nombre}" class="imagen-alimento-seleccionado">` : 
                        '<div class="sin-imagen">Sin imagen</div>'
                    }
                    <div class="info-alimento-seleccionado">
                        <h4>${alimento.nombre}</h4>
                        <p>🔥 Calorías: ${caloriasAlimento} kcal</p>
                        <p>📏 Cantidad: ${alimento.cantidad}g</p>
                    </div>
                    <div class="controles-alimento-seleccionado">
                        <input type="number" 
                            value="${alimento.cantidad}" 
                            min="1" 
                            class="entrada-cantidad"
                            onchange="actualizarCantidad(${indice}, this.value)">
                        <button class="boton-eliminar" onclick="eliminarAlimento(${indice}); mostrarAlimentosSeleccionados()">
                            🗑️
                        </button>
                    </div>
                </div>
            `;
        });

        html += `<div id="caloriasTotal">🔥 Calorías Totales: ${caloriasTotales} kcal</div>`; // Mostrar calorías totales

        // Calcular la diferencia con respecto a las calorías diarias
        const caloriasDiarias = Math.round(datosUsuario.tmb); // Obtener las calorías diarias
        const diferenciaCalorias = caloriasDiarias - caloriasTotales; // Calcular la diferencia

        // Mostrar mensaje sobre la diferencia de calorías
        if (diferenciaCalorias > 0) {
            html += `<div class="mensaje-calorias">🔻 Te faltan ${diferenciaCalorias} kcal para alcanzar tu objetivo diario.</div>`;
        } else if (diferenciaCalorias < 0) {
            html += `<div class="mensaje-calorias">⚠️ Te sobran ${Math.abs(diferenciaCalorias)} kcal sobre tu objetivo diario.</div>`;
        } else {
            html += `<div class="mensaje-calorias">✅ Estás exactamente en tu objetivo calórico.</div>`;
        }
    }

    listaAlimentosSeleccionados.innerHTML = html;
    actualizarNutrientesTotales();
}

async function buscarAlimento() {
    const entradaBusqueda = document.getElementById('entradaBusqueda').value;
    const divResultados = document.getElementById('resultadosBusqueda');
    
    divResultados.innerHTML = '<div class="cargando">Buscando productos... 🔍</div>';

    try {
        const respuesta = await fetch(`${API.ALIMENTOS}?search_terms=${encodeURIComponent(entradaBusqueda)}&search_simple=1&action=process&json=1`);
        const datos = await respuesta.json();

        let html = '';
        datos.products.forEach(producto => {
            if (producto.product_name && producto.nutriments) {
                const nutrientes = producto.nutriments;
                const urlImagen = producto.image_front_small_url || producto.image_url;
                
                let calorias = nutrientes['energy-kcal_100g'] || (nutrientes.energy_100g ? nutrientes.energy_100g / 4.184 : 0);
                
                html += `
                    <div class="item-alimento" onclick="agregarAlimento(
                        '${producto.product_name.replace(/'/g, "\\'")}',
                        ${calorias},
                        '${urlImagen || ''}',
                        {
                            calorias: ${calorias},
                            proteinas: ${nutrientes.proteins_100g || 0},
                            carbohidratos: ${nutrientes.carbohydrates_100g || 0},
                            grasas: ${nutrientes.fat_100g || 0},
                            grasasSaturadas: ${nutrientes['saturated-fat_100g'] || 0},
                            fibra: ${nutrientes.fiber_100g || 0},
                            azucar: ${nutrientes.sugars_100g || 0},
                            sodio: ${nutrientes.sodium_100g || 0}
                        }
                    )">
                        ${urlImagen ? `<img src="${urlImagen}" class="imagen-alimento" onerror="this.style.display='none'">` : ''}
                        <div class="info-alimento">
                            <div class="nombre-alimento">${producto.product_name}</div>
                            <div class="info-calorias">
                                🔥 ${Math.round(calorias)} kcal/100g<br>
                                🥩 ${Math.round(nutrientes.proteins_100g || 0)}g proteínas<br>
                                🌾 ${Math.round(nutrientes.carbohydrates_100g || 0)}g carbohidratos<br>
                                🥑 ${Math.round(nutrientes.fat_100g || 0)}g grasas
                            </div>
                        </div>
                    </div>
                `;
            }
        });

        divResultados.innerHTML = html || '<p>No se encontraron resultados</p>';

    } catch (error) {
        divResultados.innerHTML = '<p>Error al buscar alimentos. Por favor, intenta de nuevo.</p>';
        console.error('Error:', error);
    }
}

function agregarAlimento(nombre, calorias, urlImagen, nutrientes) {
    const alimento = {
        nombre: nombre,
        calorias: calorias,
        cantidad: 100,
        urlImagen: urlImagen,
        nutrientes: nutrientes,
        tipo: 'producto'
    };

    todosLosAlimentos.push(alimento);
    actualizarNutrientesTotales();
    cambiarTab('seleccionados');
}

async function analizarComida() {
    const entradaComida = document.getElementById('entrada-comida');
    const divResultados = document.getElementById('resultados-nutricion');
    
    if (!entradaComida.value.trim()) {
        mostrarError('Por favor, ingresa una comida.');
        return;
    }

    divResultados.innerHTML = '<div class="cargando">Analizando comida...</div>';

    try {
        const respuesta = await fetch(API.NUTRICION, {
            method: 'POST',
            headers: API.CABECERAS,
            body: JSON.stringify({
                query: entradaComida.value,
                locale: 'es_ES',
            })
        });

        const datos = await respuesta.json();

        if (!datos.foods || datos.foods.length === 0) {
            mostrarError('No se encontraron resultados para esta comida.');
            return;
        }

        datos.foods.forEach(comida => {
            const comidaPreparada = {
                nombre: comida.food_name,
                cantidad: comida.serving_weight_grams || 100,
                urlImagen: comida.photo?.thumb,
                tipo: 'preparado',
                nutrientes: {
                    calorias: comida.nf_calories,
                    proteinas: comida.nf_protein,
                    carbohidratos: comida.nf_total_carbohydrate,
                    grasas: comida.nf_total_fat,
                    grasasSaturadas: comida.nf_saturated_fat || 0,
                    fibra: comida.nf_dietary_fiber || 0,
                    azucar: comida.nf_sugars || 0,
                    sodio: comida.nf_sodium || 0
                }
            };
            todosLosAlimentos.push(comidaPreparada);
        });

        mostrarResultadosPreparados(datos.foods);
        actualizarNutrientesTotales();
        entradaComida.value = '';

    } catch (error) {
        console.error('Error:', error);
        mostrarError('No se pudo analizar la comida. Por favor, intenta con una descripción más clara.');
    }
}

function actualizarNutrientesTotales() {
    const divNutrientesTotales = document.getElementById('caloriasTotal');
    
    let nutrientesTotales = {
        calorias: 0,
        proteinas: 0,
        carbohidratos: 0,
        grasas: 0,
        grasasSaturadas: 0,
        fibra: 0,
        azucar: 0,
        sodio: 0
    };

    todosLosAlimentos.forEach(alimento => {
        const multiplicador = alimento.cantidad / 100;
        Object.keys(nutrientesTotales).forEach(nutriente => {
            nutrientesTotales[nutriente] += (alimento.nutrientes[nutriente] || 0) * multiplicador;
        });
    });

    let html = `
        <div class="resumen-nutricion">
            <h3>📊 Resumen Nutricional Total</h3>`;

    // Agregar comparación con TMB
    if (datosUsuario.tmb > 0) {
        const porcentajeObjetivo = (nutrientesTotales.calorias / datosUsuario.tmb) * 100;
        const diferenciaCalorias = nutrientesTotales.calorias - datosUsuario.tmb;
        const estadoCalorico = diferenciaCalorias > 0 ? 'exceso' : 'déficit';
        
        html += `
            <div class="categoria-nutrientes">
                <h4>📈 Comparación con Objetivo</h4>
                <div class="grid-nutrientes">
                    <div class="item-nutriente">Calorías Objetivo: ${Math.round(datosUsuario.tmb)} kcal</div>
                    <div class="item-nutriente">Calorías Consumidas: ${Math.round(nutrientesTotales.calorias)} kcal</div>
                    <div class="item-nutriente">Porcentaje Consumido: ${Math.round(porcentajeObjetivo)}%</div>
                    <div class="item-nutriente ${estadoCalorico}">
                        ${estadoCalorico === 'exceso' ? '⚠️' : '✅'} 
                        ${Math.abs(Math.round(diferenciaCalorias))} kcal en ${estadoCalorico}
                    </div>
                </div>
                <div class="recomendacion">
                    ${diferenciaCalorias > 0 
                        ? `🔻 Deberías reducir aproximadamente ${Math.round(diferenciaCalorias)} calorías para alcanzar tu objetivo.`
                        : diferenciaCalorias < 0
                            ? `⬆️ Deberías consumir aproximadamente ${Math.abs(Math.round(diferenciaCalorias))} calorías más para alcanzar tu objetivo.`
                            : '✅ ¡Estás exactamente en tu objetivo calórico!'}
                </div>
            </div>`;
    }

    html += `
            <div class="categoria-nutrientes">
                <h4>🔥 Macronutrientes</h4>
                <div class="grid-nutrientes">
                    <div class="item-nutriente">Calorías: ${Math.round(nutrientesTotales.calorias)} kcal</div>
                    <div class="item-nutriente">Proteínas: ${Math.round(nutrientesTotales.proteinas)}g</div>
                    <div class="item-nutriente">Carbohidratos: ${Math.round(nutrientesTotales.carbohidratos)}g</div>
                    <div class="item-nutriente">Grasas totales: ${Math.round(nutrientesTotales.grasas)}g</div>
                </div>
            </div>

            <div class="categoria-nutrientes">
                <h4>🧬 Desglose de Nutrientes</h4>
                <div class="grid-nutrientes">
                    <div class="item-nutriente">Grasas saturadas: ${Math.round(nutrientesTotales.grasasSaturadas)}g</div>
                    <div class="item-nutriente">Fibra: ${Math.round(nutrientesTotales.fibra)}g</div>
                    <div class="item-nutriente">Azúcares: ${Math.round(nutrientesTotales.azucar)}g</div>
                    <div class="item-nutriente">Sodio: ${Math.round(nutrientesTotales.sodio)}mg</div>
                </div>
            </div>
        </div>`;

    divNutrientesTotales.innerHTML = html;
}

function mostrarResultadosPreparados(comidas) {
    const divResultados = document.getElementById('resultados-nutricion');
    let html = '<h3>📊 Análisis Nutricional:</h3>';

    comidas.forEach(comida => {
        const htmlImagen = comida.photo?.thumb 
            ? `<img src="${comida.photo.thumb}" alt="${comida.food_name}" style="width: 100px; height: 100px; object-fit: cover; border-radius: 8px; margin-bottom: 10px;">`
            : '';

        html += `
            <div class="item-alimento" style="background-color: white; padding: 20px; border-radius: 10px; margin-bottom: 15px; box-shadow: var(--sombra-tarjeta);">
                ${htmlImagen}
                <h4>🍽️ ${comida.food_name}</h4>
                <p>📏 Cantidad: ${comida.serving_qty} ${comida.serving_unit}</p>
                <p>🔥 Calorías: ${Math.round(comida.nf_calories)} kcal</p>
                <p>🥩 Proteínas: ${Math.round(comida.nf_protein)}g</p>
                <p>🌾 Carbohidratos: ${Math.round(comida.nf_total_carbohydrate)}g</p>
                <p>🥑 Grasas totales: ${Math.round(comida.nf_total_fat)}g</p>
                <p>🧂 Sodio: ${Math.round(comida.nf_sodium)}mg</p>
                <p>🍯 Azúcares: ${Math.round(comida.nf_sugars || 0)}g</p>
                <p>🌿 Fibra: ${Math.round(comida.nf_dietary_fiber || 0)}g</p>
                <p>🥓 Grasas saturadas: ${Math.round(comida.nf_saturated_fat || 0)}g</p>
            </div>
        `;
    });

    divResultados.innerHTML = html;
}

function eliminarAlimento(indice) {
    todosLosAlimentos.splice(indice, 1);
    actualizarNutrientesTotales();
    mostrarAlimentosSeleccionados();
}

function actualizarCantidad(indice, nuevaCantidad) {
    todosLosAlimentos[indice].cantidad = parseFloat(nuevaCantidad);
    actualizarNutrientesTotales();
}

document.getElementById('entradaBusqueda').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        buscarAlimento();
    }
});

document.getElementById('entrada-comida').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        analizarComida();
    }
});

document.getElementById('seccionChatBot').addEventListener('mouseenter', function() {
    document.getElementById('copiarDatosChatBot').style.display = 'block'; // Mostrar el botón al entrar
});

document.getElementById('seccionChatBot').addEventListener('mouseleave', function() {
    document.getElementById('copiarDatosChatBot').style.display = 'none'; // Ocultar el botón al salir
});

// Función para copiar los datos del usuario
document.getElementById('copiarDatosChatBot').addEventListener('click', function() {
    const datos = `
        Edad: ${document.getElementById('edad').value}
        Sexo: ${document.getElementById('sexo').value}
        Peso: ${document.getElementById('peso').value} kg
        Altura: ${document.getElementById('altura').value} cm
        Nivel de Actividad: ${document.getElementById('actividad').value}
        TMB: ${Math.round(datosUsuario.tmb)} kcal
        Desayuno: 
        Almuerzo: 
        Postre: 
        Merienda: 
        Cena: 
        Objetivo de la Dieta: 
        Enfermedad Relacionada a su Alimentación: 
    `;

    navigator.clipboard.writeText(datos).then(() => {
        alert('Datos copiados al portapapeles!');
    }).catch(err => {
        console.error('Error al copiar: ', err);
    });
});
