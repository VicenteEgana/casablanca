import {addDays,isoDay} from './event-dates'
export const valley='/images/valle.jpg'; export const coast='/images/quintay.jpg'
export const wineMap='/images/mapa-ruta-del-vino.jpg'

// Fotografías aportadas al proyecto en octubre de 2026. Texto alternativo según el archivo.
export const photoAlt:Record<string,string>={[valley]:'Viñedo del valle de Casablanca con cerros al fondo',[coast]:'Ballenera de Quintay','/images/museo-maqueta.jpg':'Maqueta histórica de Casablanca en el Museo de Casablanca','/images/museo-entrada.jpg':'Entrada del Museo de Casablanca','/images/museo-ayer-hoy.jpg':'Paneles «Casablanca: ayer y hoy» con fotografías antiguas de la ciudad','/images/museo-bomberos.jpg':'Vitrina sobre la Compañía de Bomberos de Casablanca en el Museo','/images/museo-pintura.jpg':'Pintura del valle y máquina antigua en el Museo de Casablanca','/images/museo-exhibicion.jpg':'Exhibición histórica y religiosa del Museo de Casablanca','/images/vina-jardin.jpg':'Jardín de una viña con vista a los cerros del valle','/images/vina-fudres.jpg':'Sala de fudres de madera en una viña del valle','/images/vina-tienda.jpg':'Estantería de vinos en la tienda de una viña','/images/vina-sendero.jpg':'Sendero entre cipreses con los cerros del valle al fondo','/images/vina-museo.jpg':'Barricas y figuras de época en un museo del vino','/images/vina-pisadora.jpg':'Figura de una pisadora de uva en un museo del vino','/images/vina-rosal.jpg':'Rosal al inicio de una hilera de viñas','/images/vina-escultura.jpg':'Escultura de madera en una viña del valle','/images/vina-caja.jpg':'Caja de madera antigua y botellas de vino','/images/vina-figura.jpg':'Figura de época con botellas en un museo del vino','/images/vina-hilera.jpg':'Hilera de viñas con letrero de variedad','/images/vina-terraza.jpg':'Terraza con faroles y cipreses en una viña del valle','/images/vina-botellas.jpg':'Botellas de vino en la estantería de una viña','/images/vina-carreta.jpg':'Figuras de época con una carretilla de uva en un museo del vino'}
export const placePhotos=[coast,'/images/museo-maqueta.jpg','/images/museo-entrada.jpg','/images/vina-jardin.jpg','/images/vina-fudres.jpg']
const stopPhotos=['/images/vina-pisadora.jpg','/images/vina-rosal.jpg','/images/museo-pintura.jpg','/images/vina-escultura.jpg','/images/vina-caja.jpg','/images/vina-figura.jpg','/images/vina-hilera.jpg','/images/vina-sendero.jpg','/images/museo-bomberos.jpg','/images/museo-ayer-hoy.jpg','/images/museo-exhibicion.jpg','/images/museo-entrada.jpg'];
export type Content={id:string;type:string;name:string;category:string;description:string;image:string;hours:string;lat:number;lng:number;published:boolean;order:number;audio?:string;date?:string
endDate?:string;registration?:string;address?:string;demo:boolean};
export const categories=['Patrimonio','Costa y naturaleza','Viñas','Gastronomía','Alojamiento','Eventos'];
// Servicios del mapa, según la simbología del folleto «Ruta Casco Histórico» de la I. Municipalidad.
export const serviceCategories=['Baños públicos','Información turística','Cajeros','Farmacias','Carabineros','Taxis','Buses','Supermercados','Bencinera'];
const base={image:valley,hours:'Horario por confirmar con la Oficina de Turismo',published:true,demo:true,lat:-33.3169,lng:-71.4098,audio:''};
const pending=' Reseña de trabajo: la Oficina de Turismo debe validar el texto, la fotografía y el punto exacto del QR.';
// Paradas oficiales del folleto municipal. Coordenadas aproximadas a partir de OpenStreetMap.
const stops:[string,string,number,number,string,string][]=[
['El Control','Av. Constitución con Alejandro Galaz',-33.3166,-71.40874,'Espacio público · acceso libre','Punto de inicio de la Ruta Casco Histórico, en la entrada al centro por Av. Constitución. Desde aquí se recorre a pie el corazón de Casablanca, entre casas patrimoniales, plazas y edificios cívicos.'],
['Plaza Bicentenario','Chapito con Chacabuco',-33.31809,-71.40424,'Espacio público · acceso libre','Plaza de barrio donde el recorrido gira hacia la calle Chacabuco. Es un buen lugar para hacer una pausa antes de continuar hacia las casas históricas.'],
['Casa Presidente Jorge Montt','Calle Chacabuco, entre Buin y Roberto Loyola',-33.31936,-71.40616,'Vista exterior · horario por confirmar','Casa vinculada a Jorge Montt Álvarez, presidente de Chile entre 1891 y 1896 y nacido en Casablanca. La fachada recuerda la arquitectura tradicional del centro.'],
['Casa Poeta Alejandro Galaz','Calle Chacabuco, cerca de Av. Diego Portales',-33.32152,-71.40753,'Vista exterior · horario por confirmar','Casa asociada al poeta casablanquino Alejandro Galaz, cuyo nombre también llevan una calle y la biblioteca pública de la comuna.'],
['Almacén Don Lalo','Av. Diego Portales esquina Chacabuco',-33.32179,-71.40769,'Horario comercial por confirmar','Almacén de barrio que forma parte de la memoria cotidiana del casco histórico. Representa el comercio tradicional que acompaña la vida del centro.'],
['Casa Julio Montt Salamanca','Av. Diego Portales, entre Chacabuco y Membrillar',-33.32175,-71.40864,'Vista exterior · horario por confirmar','Casona del casco histórico ligada a la familia Montt. Su volumen de un piso y fachada continua es característico de la arquitectura tradicional de la zona central.'],
['Cooperativa Agrícola','Av. Diego Portales esquina General Óscar Bonilla',-33.32124,-71.40982,'Vista exterior · horario por confirmar','Edificio que recuerda la vocación agrícola del valle de Casablanca, antes y después de la llegada de las viñas.'],
['Plaza de Armas','Av. Constitución, Maipú, Gral. Óscar Bonilla y Av. Diego Portales',-33.32052,-71.41011,'Espacio público · acceso libre','Centro cívico de Casablanca. En sus alrededores se encuentran la parroquia, la municipalidad y el comercio del centro. Observa sus monumentos y el movimiento cotidiano de la ciudad.'],
['1° Compañía de Bomberos','Maipú esquina General Óscar Bonilla',-33.3202,-71.40945,'Vista exterior','Cuartel de la Primera Compañía del Cuerpo de Bomberos de Casablanca, institución formada por voluntarios.'],
['I. Municipalidad de Casablanca','Av. Constitución 111',-33.31973,-71.41052,'Atención de público según horario municipal','Edificio consistorial de la comuna. Aquí funciona la administración municipal de Casablanca.'],
['Parroquia Santa Bárbara','Av. Diego Portales con Av. Constitución',-33.32044,-71.41089,'Horario de misas por confirmar','Templo dedicado a Santa Bárbara, patrona de la ciudad, fundada en el siglo XVIII como Santa Bárbara de la Reina de Casablanca.'],
['Centro Cultural y Museo','Av. Diego Portales',-33.3207,-71.41122,'Horario por confirmar con el Centro Cultural','Cierre del recorrido. El Centro Cultural reúne el Museo Arqueológico y Antropológico de Casablanca y espacios para actividades artísticas de la comunidad.']];
// Vértices por calles entre cada parada y la siguiente, para dibujar el recorrido del folleto.
export const routeVia:Record<string,[number,number][]>={
p01:[[-33.31603,-71.40895],[-33.31598,-71.40814],[-33.31634,-71.40765],[-33.3167,-71.40716],[-33.31728,-71.40634],[-33.3178,-71.40555],[-33.31815,-71.40504]],
p02:[[-33.31815,-71.40504],[-33.31891,-71.40586],[-33.31904,-71.40601]],
p03:[[-33.31953,-71.40652],[-33.32017,-71.40695],[-33.32097,-71.40736]],
p04:[],
p05:[[-33.32194,-71.4079]],
p06:[[-33.32153,-71.4088],[-33.32112,-71.40974]],
p07:[[-33.32112,-71.40974]],
p08:[[-33.32038,-71.40932]],
p09:[[-33.32018,-71.4099],[-33.32005,-71.41031],[-33.3198,-71.41019]],
p10:[[-33.3198,-71.41019],[-33.32005,-71.41031],[-33.32073,-71.41066]],
p11:[[-33.32064,-71.4109],[-33.32052,-71.41118]]};
// Servicios tomados de la simbología del folleto y de OpenStreetMap. Requieren confirmación municipal.
const services:[string,string,string,number,number,string,string][]=[
['banos-oit','Baños públicos · Oficina de Turismo','Baños públicos',-33.31952,-71.4099,'Av. Constitución, entre Maipú y Matucana','Baños señalados en el folleto municipal junto a la Oficina de Información Turística. Confirma horario y accesibilidad.'],
['info-oit','Oficina de Información Turística','Información turística',-33.31966,-71.41008,'Av. Constitución, entre Maipú y Matucana','Punto «Estás aquí» del folleto municipal. Entrega orientación, mapas y datos de prestadores turísticos.'],
['cajero-itau','Cajero automático Itaú','Cajeros',-33.31995,-71.41003,'Av. Constitución con Maipú','Cajero automático según OpenStreetMap.'],
['cajero-bci','BCI','Cajeros',-33.321,-71.40957,'Av. Diego Portales 105','Sucursal bancaria. Consulta la disponibilidad del cajero automático.'],
['cajero-chile','Banco de Chile','Cajeros',-33.32145,-71.40864,'Av. Diego Portales 211','Sucursal bancaria. Consulta la disponibilidad del cajero automático.'],
['cajero-santander','Banco Santander','Cajeros',-33.3221,-71.40784,'Av. Diego Portales','Sucursal bancaria. Consulta la disponibilidad del cajero automático.'],
['cajero-bancoestado','BancoEstado','Cajeros',-33.3221,-71.40713,'Av. Diego Portales 377','Sucursal bancaria. Consulta la disponibilidad del cajero automático.'],
['farmacia-simi','Farmacias del Dr. Simi','Farmacias',-33.31934,-71.40986,'Av. Constitución','Farmacia según OpenStreetMap.'],
['farmacia-cruzverde-chacabuco','Farmacia Cruz Verde','Farmacias',-33.3196,-71.40647,'Chacabuco 294','Farmacia según OpenStreetMap.'],
['farmacia-famifarma','Farmacia Famifarma','Farmacias',-33.32013,-71.40684,'Chacabuco 208','Farmacia según OpenStreetMap.'],
['farmacia-cruzverde-portales','Farmacia Cruz Verde','Farmacias',-33.32255,-71.40531,'Av. Diego Portales, sector Santa Isabel','Farmacia según OpenStreetMap.'],
['carabineros','5ª Comisaría de Carabineros','Carabineros',-33.32036,-71.40837,'Membrillar 125','Unidad policial de Casablanca. En emergencias llama al 133.'],
['taxis-maipu','Paradero de taxis Maipú','Taxis',-33.31997,-71.4105,'Maipú, frente a la Plaza de Armas','Paradero de taxis según OpenStreetMap y el folleto municipal.'],
['taxis-portales','Paradero de taxis Portales','Taxis',-33.32207,-71.40737,'Av. Diego Portales','Paradero de taxis según OpenStreetMap.'],
['buses-pullman','Oficina Pullman Bus','Buses',-33.32012,-71.41053,'Av. Constitución con Maipú','Venta de pasajes y salida de buses interurbanos. Confirma horarios con la empresa.'],
['buses-constitucion','Paradero de buses Av. Constitución','Buses',-33.32039,-71.41037,'Av. Constitución, frente a la parroquia','Paradero de buses según OpenStreetMap y el folleto municipal.'],
['buses-portales','Paradero de buses Av. Diego Portales','Buses',-33.32195,-71.40774,'Av. Diego Portales','Paradero de buses según OpenStreetMap.'],
['super-unimarc','Unimarc','Supermercados',-33.31973,-71.40993,'Maipú','Supermercado según OpenStreetMap.'],
['super-santa-isabel','Santa Isabel','Supermercados',-33.32249,-71.40513,'Av. Diego Portales','Supermercado según OpenStreetMap.'],
['super-erbi','Supermercados Erbi','Supermercados',-33.31999,-71.4069,'Chacabuco','Supermercado según OpenStreetMap.'],
['bencinera-copec','Copec','Bencinera',-33.31573,-71.40877,'Av. Constitución, salida a Valparaíso','Estación de servicio según OpenStreetMap y el folleto municipal.']];
// Eventos de ejemplo con fechas relativas al día en que se crea la base local, para que la agenda muestre el mes en curso.
const today=isoDay(new Date())

export const seed:Content[]=[
{...base,id:'casco-historico',type:'route',image:'/images/museo-maqueta.jpg',name:'Ruta Casco Histórico',category:'Patrimonio',description:'Recorre a pie el centro de Casablanca siguiendo la ruta del folleto de la I. Municipalidad: doce paradas desde El Control hasta el Centro Cultural y Museo, pasando por casas patrimoniales, la Plaza de Armas y la Parroquia Santa Bárbara. Cada parada tiene ficha, código QR y audioguía.',order:0},
{...base,id:'quintay',type:'experience',name:'Quintay, encuentro con el mar',category:'Costa y naturaleza',description:'El borde costero de Quintay forma parte del patrimonio que el informe propone visibilizar. Esta ficha permite explorar esa experiencia. Los horarios y las condiciones de acceso deben confirmarse antes de viajar.',image:coast,lat:-33.1944,lng:-71.7024,order:1},
{...base,id:'valle',type:'experience',name:'Paisajes y viñas del valle',image:'/images/vina-jardin.jpg',category:'Viñas',description:'El enoturismo es una de las experiencias del Valle de Casablanca. Explora su paisaje y consulta a la Oficina de Turismo por prestadores y visitas disponibles. La ruta de vinos completa corresponde a una etapa posterior.',lat:-33.306,lng:-71.36,order:2},
// Viñas según el mapa «Ruta del Vino Casablanca» entregado al proyecto.
{...base,id:'ruta-del-vino',type:'experience',name:'Ruta del Vino de Casablanca',category:'Viñas',image:'/images/vina-fudres.jpg',description:'El mapa de la Ruta del Vino de Casablanca reúne trece viñas repartidas por el valle: Casas del Bosque, Kingston Family Vineyards, La Recova, Bodegas RE, Estancia El Cuadro, López Pangue, Villard, Tapihue, Viñamar, Matetic, Indómita, Emiliana y Veramonte. Varias ofrecen restaurante o gastronomía con reserva previa. Confirma horarios y reservas directamente con cada viña antes de viajar.',hours:'Según cada viña · reserva previa recomendada',lat:-33.3,lng:-71.35,order:2},
{...base,id:'cocina-demo',type:'provider',image:'/images/vina-tienda.jpg',name:'Cocina local · ejemplo',category:'Gastronomía',description:'Ficha de demostración para un emprendimiento gastronómico. No representa a un negocio real ni acredita registro en SERNATUR.',order:3,registration:'DEMO — sin validación'},
{...base,id:'alojamiento-demo',type:'provider',image:'/images/vina-terraza.jpg',name:'Alojamiento rural · ejemplo',category:'Alojamiento',description:'Ficha de demostración de un alojamiento. Permite ensayar la administración de servicios sin atribuir información a un negocio real.',order:4,registration:'DEMO — sin validación'},
{...base,id:'encuentro-demo',type:'event',image:'/images/vina-museo.jpg',name:'Encuentro patrimonial · ejemplo',category:'Eventos',description:'Evento ficticio para probar la agenda y el panel municipal. No corresponde a una actividad anunciada ni a una reserva.',date:addDays(today,3),hours:'11:00 – 13:00',address:'Centro Cultural de Casablanca',lat:-33.3207,lng:-71.41122,order:5},
{...base,id:'muestra-vinos-demo',type:'event',image:'/images/vina-botellas.jpg',name:'Muestra de vinos del valle · ejemplo',category:'Eventos',description:'Evento ficticio de dos días para probar la agenda con actividades de varias jornadas. No corresponde a una actividad anunciada.',date:addDays(today,10),endDate:addDays(today,11),hours:'12:00 – 19:00',address:'Plaza de Armas de Casablanca',lat:-33.32052,lng:-71.41011,order:6},
{...base,id:'recorrido-guiado-demo',type:'event',image:'/images/vina-carreta.jpg',name:'Recorrido guiado por el casco histórico · ejemplo',category:'Eventos',description:'Evento ficticio para probar la agenda. Un recorrido guiado real debe confirmarse con la Oficina de Turismo.',date:addDays(today,17),hours:'10:30 – 12:00',address:'El Control, Av. Constitución con Alejandro Galaz',lat:-33.3166,lng:-71.40874,order:7},
...stops.map(([name,address,lat,lng,hours,text],i)=>({...base,id:'p'+String(i+1).padStart(2,'0'),type:'point',image:stopPhotos[i]||valley,name,category:'Patrimonio',order:i+1,lat,lng,hours,address,description:text+pending})),
...services.map(([id,name,category,lat,lng,address,description],i)=>({...base,id:'servicio-'+id,type:'service',name,category,lat,lng,address,description,hours:category==='Taxis'||category==='Buses'?'Servicio en la vía pública':'Horario por confirmar',order:200+i}))
];
