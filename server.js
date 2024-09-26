const puppeteer = require('puppeteer');

(async () => {


  const number = '980258482';


  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  console.log('Navegando para o WhatsApp Web...');
  await page.goto('https://web.whatsapp.com'); 

  console.log('Aguardando botão de login...');
  await new Promise(resolve => setTimeout(resolve, 5000)); //necessário aguardar para que o whatsapp obtenha o pais de origem e preencha sozinho
  await page.waitForSelector('span[role="button"][tabindex="0"].x1n68mz9');
  await page.click('span[role="button"][tabindex="0"].x1n68mz9');


  console.log('Aguardando campo de telefone...');
  await new Promise(resolve => setTimeout(resolve, 2000));
  await page.waitForSelector('input[aria-label="Insira seu número de telefone."]');


  await page.type('input[aria-label="Insira seu número de telefone."]', number);

  // Aguarda 1 segundo
  await new Promise(resolve => setTimeout(resolve, 1000));
  console.log('Aguardando botão "Avançar"...');
  await page.waitForSelector('#app > div > div.landing-wrapper > div.landing-window > div.landing-main > div > div.x1c4vz4f.xs83m0k.xdl72j9.x1g77sc7.x78zum5.xozqiw3.x1oa3qoh.x12fk4p8.xeuugli.x2lwn1j.x1nhvcw1.xdt5ytf.x1qjc9v5 > div.x1c4vz4f.xs83m0k.xdl72j9.x1g77sc7.xeuugli.x2lwn1j.xozqiw3.xamitd3.x12fk4p8.x1hq5gj4 > button');
  await page.click('#app > div > div.landing-wrapper > div.landing-window > div.landing-main > div > div.x1c4vz4f.xs83m0k.xdl72j9.x1g77sc7.x78zum5.xozqiw3.x1oa3qoh.x12fk4p8.xeuugli.x2lwn1j.x1nhvcw1.xdt5ytf.x1qjc9v5 > div.x1c4vz4f.xs83m0k.xdl72j9.x1g77sc7.xeuugli.x2lwn1j.xozqiw3.xamitd3.x12fk4p8.x1hq5gj4 > button');

  console.log('Aguardando o código...');
  await page.waitForSelector('.x1n2onr6.x78zum5.x1okw0bk.x6s0dn4.xl56j7k.x14atkfc.x1vd4hg5.xrxr3ny', { timeout: 60000 }); //aguarda nova tela

  // Extrai o código dos spans
  const codigo = await page.evaluate(() => {
    const spans = Array.from(document.querySelectorAll('.x1n2onr6.x78zum5.x1okw0bk.x6s0dn4.xl56j7k.x14atkfc.x1vd4hg5.xrxr3ny .x1c4vz4f span'));
    return spans.map(span => span.innerText).join(''); // Junte os textos
  });

  console.log('Código recebido:', codigo || 'Nenhum código encontrado');

})();
