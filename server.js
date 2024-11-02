const express = require("express");
const puppeteer = require("puppeteer");
const path = require("path");

const app = express();
app.use(express.json());

// Configura a pasta estática para servir o index.html
app.use(express.static(path.join(__dirname)));

app.post("/get-code", async (req, res) => {
  const { number } = req.body;

  if (!number) {
    return res.status(400).json({ error: "Digite seu numero" });
  }

  try {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    await page.setViewport({ width: 1280, height: 800 });

    await page.goto("https://web.whatsapp.com");
    await new Promise(resolve => setTimeout(resolve, 5000)); 

    const phoneButtonSelector = 'span[role="button"][tabindex="0"].x1n68mz9';
    const phoneInputSelector = 'input[aria-label="Insira seu número de telefone."]';
    const continueButtonSelector = '#app > div > div.landing-wrapper > div.landing-window > div.landing-main > div > div.x1c4vz4f.xs83m0k.xdl72j9.x1g77sc7.x78zum5.xozqiw3.x1oa3qoh.x12fk4p8.xeuugli.x2lwn1j.x1nhvcw1.xdt5ytf.x1qjc9v5 > div.x1c4vz4f.xs83m0k.xdl72j9.x1g77sc7.xeuugli.x2lwn1j.xozqiw3.xamitd3.x12fk4p8.x1hq5gj4 > button';
    
    while (true) {
      try {
        await page.waitForSelector(phoneButtonSelector, { timeout: 5000 });
        await page.click(phoneButtonSelector);

        await new Promise(resolve => setTimeout(resolve, 5000)); 
        await page.waitForSelector(phoneInputSelector, { timeout: 5000 });
        await page.type(phoneInputSelector, number);

        await new Promise(resolve => setTimeout(resolve, 5000)); 
        await page.waitForSelector(continueButtonSelector, { timeout: 5000 });
        await page.click(continueButtonSelector);

        await page.waitForSelector('.x1n2onr6.x78zum5.x1okw0bk.x6s0dn4.xl56j7k.x14atkfc.x1vd4hg5.xrxr3ny', { timeout: 60000 }); //codigo

        const code = await page.evaluate(() => { //guarda o codigo em uma variavel
          const spans = Array.from(document.querySelectorAll('.x1n2onr6.x78zum5.x1okw0bk.x6s0dn4.xl56j7k.x14atkfc.x1vd4hg5.xrxr3ny .x1c4vz4f span'));
          return spans.map(span => span.innerText).join('');
        });

        await browser.close();
        res.json({ code });
        return;

      } catch (error) {
        console.error("Erro ao encontrar botão, recarregando a página...", error);

        // Limpa o cache
        await page.evaluate(() => {
          caches.keys().then(function(names) {
            for (let name of names) {
              caches.delete(name);
            }
          });
        });
      
        await page.reload({ waitUntil: 'networkidle0' });
        await new Promise(resolve => setTimeout(resolve, 5000));
      }
    }
    
  } catch (error) {
    console.error("Erro ao capturar código", error);
    res.status(500).json({ error: "Erro ao capturar o código" });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor executado em http://localhost:${PORT}`);
});
