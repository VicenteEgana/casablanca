// Fechas de la agenda. Se guardan como texto AAAA-MM-DD y se interpretan en la hora local del navegador
// o del servidor, sin conversión de zona horaria, para que un evento no cambie de día.
export const MONTHS=['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
export const WEEKDAYS=['lunes','martes','miércoles','jueves','viernes','sábado','domingo'];

type Dated={date?:string,endDate?:string};

export const isDay=(value?:string):value is string=>!!value&&/^\d{4}-\d{2}-\d{2}$/.test(value);
export const capitalize=(text:string)=>text.charAt(0).toLocaleUpperCase('es')+text.slice(1);

export function isoDay(date:Date){return date.getFullYear()+'-'+String(date.getMonth()+1).padStart(2,'0')+'-'+String(date.getDate()).padStart(2,'0')}
export function parseDay(day:string){const [y,m,d]=day.split('-').map(Number);return new Date(y,m-1,d)}
export function addDays(day:string,days:number){const date=parseDay(day);date.setDate(date.getDate()+days);return isoDay(date)}

// Último día de un evento: su fecha de término si es válida y posterior al inicio; si no, el mismo día.
export function eventEnd(event:Dated){return isDay(event.endDate)&&isDay(event.date)&&event.endDate>=event.date?event.endDate:event.date||''}
export function occursOn(event:Dated,day:string){return isDay(event.date)&&event.date<=day&&day<=eventEnd(event)}
export function isPast(event:Dated,today=isoDay(new Date())){return isDay(event.date)&&eventEnd(event)<today}

export function formatDay(day:string){const d=parseDay(day);return WEEKDAYS[(d.getDay()+6)%7]+' '+d.getDate()+' de '+MONTHS[d.getMonth()]}
export function formatEventDate(event:Dated){
  if(!isDay(event.date))return 'Fecha por confirmar';
  const end=eventEnd(event);
  if(end===event.date)return capitalize(formatDay(event.date));
  const a=parseDay(event.date),b=parseDay(end);
  return a.getMonth()===b.getMonth()&&a.getFullYear()===b.getFullYear()
    ?'Del '+a.getDate()+' al '+b.getDate()+' de '+MONTHS[b.getMonth()]
    :'Del '+a.getDate()+' de '+MONTHS[a.getMonth()]+' al '+b.getDate()+' de '+MONTHS[b.getMonth()];
}
