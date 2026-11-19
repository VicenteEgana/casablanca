'use client';
import {useMemo,useState} from 'react';
import {ChevronLeft,ChevronRight,Clock,MapPin,CalendarDays} from 'lucide-react';
import type {Content} from './data';
import {MONTHS,capitalize,eventEnd,formatDay,formatEventDate,isDay,isoDay,occursOn,parseDay} from './event-dates';

const WEEK=['Lun','Mar','Mié','Jue','Vie','Sáb','Dom'];

function EventItem({event}:{event:Content}){
  const day=isDay(event.date)?parseDay(event.date):null;
  return <a className="event-item" href={'#p/'+encodeURIComponent(event.id)}>
    <div className="event-date" aria-hidden="true">{day?<><strong>{day.getDate()}</strong><span>{MONTHS[day.getMonth()].slice(0,3)}</span></>:<strong>—</strong>}</div>
    <div className="event-body">
      <h3>{event.name}</h3>
      <p className="event-meta"><span><CalendarDays size={15}/>{formatEventDate(event)}</span>{event.hours&&<span><Clock size={15}/>{event.hours}</span>}{event.address&&<span><MapPin size={15}/>{event.address}</span>}</p>
      <p>{event.description.slice(0,150)}{event.description.length>150?'…':''}</p>
      {event.demo&&<span className="tag">EJEMPLO</span>}
    </div>
  </a>;
}

export default function Events({items}:{items:Content[]}){
  const today=isoDay(new Date());
  const [month,setMonth]=useState(today.slice(0,7)),[selected,setSelected]=useState('');
  const events=useMemo(()=>items.filter(e=>e.type==='event').sort((a,b)=>(a.date||'9999').localeCompare(b.date||'9999')||(a.hours||'').localeCompare(b.hours||'','es')),[items]);
  const dated=events.filter(e=>isDay(e.date)),undated=events.filter(e=>!isDay(e.date));
  const [y,m]=month.split('-').map(Number);
  const days=new Date(y,m,0).getDate(),lead=(new Date(y,m-1,1).getDay()+6)%7;
  const first=month+'-01',last=month+'-'+String(days).padStart(2,'0');
  const inMonth=dated.filter(e=>e.date!<=last&&eventEnd(e)>=first);
  const list=selected?dated.filter(e=>occursOn(e,selected)):inMonth;
  const cells:string[]=[...Array(lead).fill(''),...Array.from({length:days},(_,i)=>month+'-'+String(i+1).padStart(2,'0'))];
  while(cells.length%7)cells.push('');
  const weeks=Array.from({length:cells.length/7},(_,i)=>cells.slice(i*7,i*7+7));
  function move(step:number){setMonth(isoDay(new Date(y,m-1+step,1)).slice(0,7));setSelected('')}

  return <>
    <div className="page-head"><span className="eyebrow">AGENDA DE CASABLANCA</span><h1>Eventos y actividades</h1><p>Fiestas, ferias, recorridos y actividades culturales del valle. Elige un día marcado en el calendario para ver su programación.</p></div>
    <div className="events-layout">
      <section className="panel calendar" aria-label="Calendario de eventos">
        <div className="calendar-head">
          <button className="btn secondary small" onClick={()=>move(-1)} aria-label="Mes anterior"><ChevronLeft size={18}/></button>
          <h2 aria-live="polite">{capitalize(MONTHS[m-1])} {y}</h2>
          <button className="btn secondary small" onClick={()=>move(1)} aria-label="Mes siguiente"><ChevronRight size={18}/></button>
        </div>
        {month!==today.slice(0,7)&&<button className="btn ghost small calendar-today" onClick={()=>{setMonth(today.slice(0,7));setSelected('')}}>Volver al mes actual</button>}
        <table className="calendar-grid">
          <caption className="sr-only">Eventos de {MONTHS[m-1]} de {y}</caption>
          <thead><tr>{WEEK.map(d=><th key={d} scope="col">{d}</th>)}</tr></thead>
          <tbody>{weeks.map((week,i)=><tr key={i}>{week.map((day,j)=>{
            if(!day)return <td key={'blank'+j}/>;
            const dayEvents=dated.filter(e=>occursOn(e,day));
            const count=dayEvents.length;
            return <td key={day}><button className={'day'+(day===today?' today':'')+(count?' has-events':'')+(selected===day?' selected':'')} disabled={!count} aria-pressed={count?selected===day:undefined} aria-label={capitalize(formatDay(day))+(count?', '+count+(count>1?' actividades':' actividad'):', sin actividades')} onClick={()=>setSelected(selected===day?'':day)}>
              <span className="day-number">{Number(day.slice(8))}</span>
              {dayEvents.slice(0,2).map(e=><span className="day-event" key={e.id}>{e.name}</span>)}
              {count>2&&<span className="day-more">+{count-2} más</span>}
              {count>0&&<span className="day-dots" aria-hidden="true">{dayEvents.slice(0,3).map(e=><i key={e.id}/>)}</span>}
            </button></td>;
          })}</tr>)}</tbody>
        </table>
      </section>
      <section className="events-list" aria-live="polite">
        <div className="events-list-head"><h2>{selected?capitalize(formatDay(selected)):'Actividades de '+MONTHS[m-1]}</h2>{selected&&<button className="btn ghost small" onClick={()=>setSelected('')}>Ver todo el mes</button>}</div>
        {list.length===0?<div className="empty">{selected?'No hay actividades este día.':'No hay actividades publicadas para este mes.'}</div>:list.map(e=><EventItem key={e.id} event={e}/>)}
        {!selected&&undated.length>0&&<><h3 className="events-subhead">Fecha por confirmar</h3>{undated.map(e=><EventItem key={e.id} event={e}/>)}</>}
      </section>
    </div>
  </>;
}
