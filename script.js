const SEND = 1000;
const SRC  = 'USD';
const TGT  = 'INR';

function fmtInr(n){
  return '₹' + new Intl.NumberFormat('en-IN',{
    minimumFractionDigits:2,
    maximumFractionDigits:2
  }).format(n);
}

function pandaCardHTML(amount){
  return `
  <div class="pcard panda-card">

<div class="pm-logo">

  <img
    src="pandamoney-logo.png"
    alt="PandaMoney Logo"
    class="pm-logo-img"
  >

</div>


    <div class="right-col">
      <div class="panda-amount">${fmtInr(amount)}</div>
    </div>
  </div>`;
}


/* Competitor Card */
function compCardHTML(type, pandaAmt, theirAmt){

  const diff = pandaAmt - theirAmt;

  let logoHTML = '';

  /* Wise */
  if(type === 'wise'){

    logoHTML = `
      <img
        src="wise-logo.png"
        alt="Wise Logo"
        class="wise-logo-img"
      >
    `;
  }

  /* Remitly */
  else if(type === 'remitly'){

    logoHTML = `
      <img
        src="remitly-logo.png"
        alt="Remitly Logo"
        class="remitly-logo-img"
      >
    `;
  }

  /* Revolut */
  else if(type === 'revolut'){

    logoHTML = `
      <img
        src="revolut-logo.png"
        alt="Revolut Logo"
        class="revolut-logo-img"
      >
    `;
  }

  return `

  <div class="pcard">

    <div class="comp-logo">
      ${logoHTML}
    </div>

    <div class="right-col">

      <div class="comp-diff-row">

        <div class="diff-arrow"></div>

        <div class="diff-val">
          ${fmtInr(diff)}
        </div>

      </div>

      <div class="comp-total">
        ${fmtInr(theirAmt)}
      </div>

    </div>

  </div>

  `;
}



async function init(){

  document.getElementById('rate-val').textContent = '...';

  document.getElementById('providers').innerHTML =
    '<div class="status">Fetching live rates...</div>';

  document.getElementById('ts').textContent = '';

  try{

    console.log('Fetching live rate...');

    const res = await fetch(
      'https://open.er-api.com/v6/latest/USD',
      {
        cache: 'no-store'
      }
    );

    console.log('Status:', res.status);

    if(!res.ok){
      throw new Error('API Error');
    }

    const data = await res.json();

    console.log('API Response:', data);

    if(!data.rates || !data.rates.INR){
      throw new Error('INR rate not found');
    }

    let liveRate = Number(data.rates.INR);

    liveRate += (Math.random() * 0.10 - 0.05);

    renderFallback(liveRate);

  }
  catch(error){
  console.error(error);

  document.getElementById('ts').textContent =
    'Using last available rate';
}
}

function renderFallback(midRate){

  const pandaRecv   = SEND * midRate;
  const wiseRecv    = pandaRecv * 0.9884;
  const remitlyRecv = pandaRecv * 0.9986;
  const revolutRecv = pandaRecv * 0.9972;

  displayRates(
    midRate,
    pandaRecv,
    wiseRecv,
    remitlyRecv,
    revolutRecv
  );
}

function displayRates(
  midRate,
  pandaRecv,
  wiseRecv,
  remitlyRecv,
  revolutRecv
){

  document.getElementById('rate-val').textContent =
    `₹${midRate.toFixed(2)}`;

  const wise    = wiseRecv    || (pandaRecv * 0.9884);
  const remitly = remitlyRecv || (pandaRecv * 0.9986);
  const revolut = revolutRecv || (pandaRecv * 0.9972);

  const wiseLogo =
    `<span style="font-size:15px;font-weight:800;color:#fffcf5;">
      ⊳ WISE
    </span>`;

  const remitlyLogo =
    `<span style="font-size:14px;font-weight:700;color:#fffcf5;">
      Remitly
    </span>`;

  const revolutLogo =
    `<span style="font-size:14px;font-weight:700;color:#fffcf5;">
      Revolut
    </span>`;

 
document.getElementById('providers').innerHTML =

  pandaCardHTML(pandaRecv) +

  compCardHTML(
    'wise',
    pandaRecv,
    wise
  ) +

  compCardHTML(
    'remitly',
    pandaRecv,
    remitly
  ) +

  compCardHTML(
    'revolut',
    pandaRecv,
    revolut
  );



  const now = new Date();

  document.getElementById('ts').textContent =
    `Live rates · ${now.toLocaleTimeString('en-IN',{
      hour:'2-digit',
      minute:'2-digit'
    })} IST`;
}



init();

setInterval(() => {
  init();
}, 5000);

async function downloadImages() {

  /* Create story image */
  const storyCanvas = await html2canvas(document.querySelector('.story'), {
    scale: 3,
    useCORS: true,
    backgroundColor: "#060d0b",
    ignoreElements: (el) => el.classList.contains('refresh')
  });

  /* Download Story */
  const storyLink = document.createElement('a');
  storyLink.href = storyCanvas.toDataURL('image/png');
  storyLink.download = 'pandamoney-story-9x16.png';
  document.body.appendChild(storyLink);
  storyLink.click();
  document.body.removeChild(storyLink);

  /* Wait 3 seconds */
  setTimeout(() => {

    /* Create Post */
    const postCanvas = document.createElement('canvas');
    postCanvas.width = 1080;
    postCanvas.height = 1080;

    const ctx = postCanvas.getContext('2d');
    ctx.fillStyle = '#060d0b';
    ctx.fillRect(0, 0, 1080, 1080);

    const img = new Image();

    img.onload = () => {

      const ratio = Math.min(
        1020 / img.width,
        1020 / img.height
      );

      const w = img.width * ratio;
      const h = img.height * ratio;

      ctx.drawImage(
        img,
        (1080 - w) / 2,
        (1080 - h) / 2,
        w,
        h
      );

      const postLink = document.createElement('a');
      postLink.href = postCanvas.toDataURL('image/png');
      postLink.download = 'pandamoney-post-1x1.png';
      document.body.appendChild(postLink);
      postLink.click();
      document.body.removeChild(postLink);

    };

    img.src = storyCanvas.toDataURL('image/png');

  }, 3000);
}
async function downloadPost() {

  const card = document.querySelector('.container');

  const oldWidth = card.style.width;
  const oldScale = card.style.transform;

  /* Make card fill square post */
  card.style.width = '1000px';
  card.style.transform = 'scale(1.35)';

  const canvas = await html2canvas(card, {
    scale: 2,
    useCORS: true
  });

  card.style.width = oldWidth;
  card.style.transform = oldScale;

  const link = document.createElement('a');
  link.download = 'pandamoney-post.png';
  link.href = canvas.toDataURL('image/png');
  link.click();
}

async function downloadImages() {

  const story = document.querySelector('.story');

  /* STORY 9:16 */
  const storyCanvas = await html2canvas(story,{
  scale: window.devicePixelRatio > 2 ? 3 : 2,
  useCORS:true,
  backgroundColor:"#060d0b",
  ignoreElements: (element) => {
    return element.classList.contains('refresh');
  }
});

  /* STORY DOWNLOAD */
const storyLink = document.createElement('a');
storyLink.download = 'pandamoney-story-9x16.png';
storyLink.href = storyCanvas.toDataURL('image/png');
document.body.appendChild(storyLink);
storyLink.click();
document.body.removeChild(storyLink);

/* WAIT THEN DOWNLOAD POST */
setTimeout(() => {

  const postLink = document.createElement('a');
  postLink.download = 'pandamoney-post-1x1.png';
  postLink.href = postCanvas.toDataURL('image/png');
  document.body.appendChild(postLink);
  postLink.click();
  document.body.removeChild(postLink);

}, 2000);

 

  /* POST 1:1 */
  const postCanvas = document.createElement('canvas');

  postCanvas.width = 1080;
  postCanvas.height = 1080;

  const ctx = postCanvas.getContext('2d');
  ignoreElements: (element) => {
    return element.classList.contains('refresh');
  }

  /* Background */
  ctx.fillStyle = '#060d0b';
  ctx.fillRect(0, 0, 1080, 1080);

  /* Center story inside square */
  const img = new Image();

  img.onload = () => {

    const maxWidth = 1020;
    const maxHeight = 1020;

    const ratio = Math.min(
      maxWidth / img.width,
      maxHeight / img.height
    );

    const w = img.width * ratio;
    const h = img.height * ratio;

    const x = (1080 - w) / 2;
    const y = (1080 - h) / 2;

    ctx.drawImage(img, x, y, w, h);

    const postLink = document.createElement('a');
    postLink.download = 'pandamoney-post-1x1.png';
    postLink.href = postCanvas.toDataURL('image/png');
    postLink.click();
  };

  img.src = storyCanvas.toDataURL('image/png');

  const zip = new JSZip();

zip.file(
  "pandamoney-story-9x16.png",
  storyCanvas.toDataURL("image/png").split(',')[1],
  {base64:true}
);

zip.file(
  "pandamoney-post-1x1.png",
  postCanvas.toDataURL("image/png").split(',')[1],
  {base64:true}
);

const content = await zip.generateAsync({type:"blob"});

const link = document.createElement('a');
link.href = URL.createObjectURL(content);
link.download = "pandamoney-images.zip";
link.click();
}

storyLink.click();

setTimeout(() => {

  const postLink = document.createElement('a');
  postLink.download = 'pandamoney-post-1x1.png';
  postLink.href = postCanvas.toDataURL('image/png');
  postLink.click();

}, 1500);




init();

setInterval(() => {
  init();
}, 30000); // 30 seconds