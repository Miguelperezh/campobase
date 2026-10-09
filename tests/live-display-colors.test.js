import test from 'node:test';
import assert from 'node:assert/strict';
import {liveDisplayTheme,delegateLiveSelector,liveColorSelector} from '../js/live-display-colors.js';
test('live team colours project to delegate without changing saved data or other views',()=>{
 const theme={views:{hoy:{bannerBg:'#000000'},partido:{bannerBg:'#123456',uiParts:{clock:{selector:'#partido #clock',css:'color',value:'#abcdef'}},buttonColors:{'#partido #owner-auto-sub':{bg:'#123456'}},elementColors:{'#partido .live-player-row':{color:'#abcdef'}}}}};
 const before=JSON.stringify(theme),next=liveDisplayTheme(theme);
 assert.equal(next.views.delegado.bannerBg,'#123456');
 assert.equal(next.views.delegado.uiParts.clock.selector,'#delegado #delegate-clock');
 assert.equal(next.views.delegado.buttonColors['#delegado #delegate-auto-sub'].bg,'#123456');
 assert.equal(next.views.delegado.elementColors['#delegado .live-player-row'].color,'#abcdef');
 assert.equal(JSON.stringify(theme),before);assert.deepEqual(next.views.hoy,theme.views.hoy);
});
test('explicit existing delegate choices remain effective',()=>{
 const theme={views:{partido:{bannerBg:'#111111',uiParts:{name:{selector:'#partido .live-player-name',css:'color',value:'#222222'}}},delegado:{bannerBg:'#333333',uiParts:{name:{selector:'#delegado .live-player-name',css:'color',value:'#444444'}}}}};
 const next=liveDisplayTheme(theme);assert.equal(next.views.delegado.bannerBg,'#333333');assert.equal(next.views.delegado.uiParts.name.value,'#444444');
});
test('old live selectors find actual redesigned score, names, goals and progress',()=>{
 assert.equal(liveColorSelector('#partido .cbx-live-score'),'#partido .score-team > strong');
 assert.equal(liveColorSelector('#partido .player-timer .timer-minutes'),'#partido .live-player-row .live-clock-badge');
 assert.equal(liveColorSelector('#partido #goal-for-btn'),'#partido [data-cbx-live-kind="goal"]');
 assert.equal(liveColorSelector('#plantilla .player-minute-fill'),'#plantilla .player-minute-fill');
 assert.equal(delegateLiveSelector('#hoy .clock'),null);
 const theme={views:{partido:{uiParts:{score:{selector:'#partido .cbx-live-score',css:'color',value:'#111111'}}}}};
 const copy=liveDisplayTheme(theme);assert.equal(copy.views.delegado.uiParts.score.selector,'#delegado .score-team > strong');assert.equal(theme.views.partido.uiParts.score.selector,'#partido .cbx-live-score');
});
