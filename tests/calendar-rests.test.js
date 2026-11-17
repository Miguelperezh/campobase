import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFile } from 'node:fs/promises';

const source = await readFile(new URL('../js/app.js', import.meta.url), 'utf8');
const dates = source.slice(source.indexOf('function daysInMonth'), source.indexOf('function askConfirmation'));
const rests = source.slice(source.indexOf('function calendarRestEvents'), source.indexOf('function renderClaudeCalendar'));
const escapeHtml = value => String(value).replace(/[&<>"']/g, char => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[char]));
const functions = vm.runInNewContext(`${dates}\n${rests}\n({ calendarRestEvents, renderCalendarRestCard })`, {
  Date, Intl, escapeHtml, matchTypeLabel: type => type === 'league' ? 'Liga' : type,
});

test('los descansos se proyectan desde ajustes propios sin convertir otros registros ni alterar la fuente', () => {
  const records = [
    { id:'r15', recordType:'calendarRest', date:'2027-04-18', round:'15' },
    { id:'s1', recordType:'trainingSession', date:'2027-01-24', name:'Sesión' },
    { id:'r6', recordType:'calendarRest', date:'2027-01-24', round:'6' },
    { id:'bad-day', recordType:'calendarRest', date:'2027-02-30' },
    { id:'bad-hour', recordType:'calendarRest', date:'2027-01-24T00:00' },
    { id:'array-date', recordType:'calendarRest', date:['2027-01-24'] },
    { id:'object-date', recordType:'calendarRest', date:{ year:2027, month:1, day:24 } },
    { recordType:'calendarRest', date:'2027-01-24' },
    { id:'main', teamName:'Equipo' },
  ];
  const before = JSON.stringify(records);
  assert.deepEqual(Array.from(functions.calendarRestEvents(records), row => row.id), ['r6','r15']);
  assert.equal(JSON.stringify(records), before);
});

test('la tarjeta de descanso muestra jornada y día sin rival, hora, resultado ni acciones deportivas', () => {
  const html = functions.renderCalendarRestCard({ id:'r6', recordType:'calendarRest', date:'2027-01-24', round:'6', title:'Descansa', competitionType:'league' });
  assert.match(html, /data-calendar-rest-id="r6"/);
  assert.match(html, /data-match-day="2027-01-24"/);
  assert.match(html, /J6 · Liga/);
  assert.match(html, /<h3>Descansa<\/h3>/);
  assert.match(html, /Jornada sin partido/);
  assert.doesNotMatch(html, /data-match-id=|data-training-id=|<button|<select|00:00|Marcador|Realizado|Convocar|Preparar/);
});

test('los textos de descansos se escapan como el resto del calendario', () => {
  const html = functions.renderCalendarRestCard({ id:'r"x', date:'2027-04-18', round:'15<script>', title:'<img src=x onerror=x>' });
  assert.match(html, /data-calendar-rest-id="r&quot;x"/);
  assert.match(html, /J15&lt;script&gt;/);
  assert.doesNotMatch(html, /<img|<script/);
});
