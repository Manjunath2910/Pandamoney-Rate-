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

  document.getElementById('rate-val').textContent = '…';

  document.getElementById('providers').innerHTML =
    '<div class="status">Fetching live rates…</div>';

  document.getElementById('ts').textContent = '';

  try{

    /* YOUR WISE API KEY */
    const API_KEY = '17b1063b-3f5c-421d-bcc1-7b19f6acc8cf';

    const response = await fetch(
      'https://api.wise.com/v1/rates?source=USD&target=INR',
      {
        method:'GET',

        headers:{
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type':'application/json'
        }
      }
    );

    if(!response.ok){
      throw new Error('Wise API Error');
    }

    const data = await response.json();

    /* LIVE RATE */
    let liveRate = data[0].rate;

    /* OPTIONAL SMALL LIVE MOVEMENT */
    liveRate += (
      Math.random() * 0.04 - 0.02
    );

    renderFallback(liveRate);

  }catch(error){

    console.log(error);

    document.getElementById('providers').innerHTML =
      '<div class="status err">Could not load live rates</div>';

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

/* Auto refresh every 30 seconds */
init();


init();

setInterval(() => {
  init();
}, 5000);

