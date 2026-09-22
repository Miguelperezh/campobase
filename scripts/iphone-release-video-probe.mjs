import { webkit, devices } from 'playwright';

const VIDEO = 'https://github.com/Miguelperezh/campobase/releases/download/campobase-videos-v1/library-v2-preview__f7-126__ejercicio.mp4';

const browser = await webkit.launch();
const context = await browser.newContext({ ...devices['iPhone 15'] });
const page = await context.newPage();

const network = [];
page.on('response', (response) => {
  const url = response.url();
  if (/github|release-assets|mp4/i.test(url)) {
    network.push({
      status: response.status(),
      url,
      contentType: response.headers()['content-type'] || '',
      disposition: response.headers()['content-disposition'] || '',
      acceptRanges: response.headers()['accept-ranges'] || '',
      contentRange: response.headers()['content-range'] || '',
    });
  }
});

await page.setContent(`
<!doctype html>
<meta name="viewport" content="width=device-width,initial-scale=1">
<button id="play">Play</button>
<video id="v" playsinline muted loop preload="none" style="width:100%"></video>
<script>
  const v = document.getElementById('v');
  v.src = ${JSON.stringify(VIDEO)};
  window.events = [];
  for (const name of ['loadstart','loadedmetadata','loadeddata','canplay','play','playing','pause','waiting','stalled','suspend','error']) {
    v.addEventListener(name, () => window.events.push({
      name,
      t: performance.now(),
      readyState: v.readyState,
      networkState: v.networkState,
      currentTime: v.currentTime,
      error: v.error ? {code:v.error.code,message:v.error.message} : null
    }));
  }
  document.getElementById('play').addEventListener('click', async () => {
    try {
      await v.play();
      window.playResult = {ok:true};
    } catch (e) {
      window.playResult = {ok:false,name:e.name,message:e.message};
    }
  });
</script>`);

await page.click('#play');
await page.waitForTimeout(7000);

const state = await page.evaluate(() => {
  const v = document.getElementById('v');
  return {
    playResult: window.playResult || null,
    currentTime: v.currentTime,
    duration: v.duration,
    paused: v.paused,
    readyState: v.readyState,
    networkState: v.networkState,
    error: v.error ? {code:v.error.code,message:v.error.message} : null,
    events: window.events,
  };
});

console.log(JSON.stringify({state, network}, null, 2));
await browser.close();

if (!state.playResult?.ok || state.currentTime < 1 || state.error) process.exit(2);
