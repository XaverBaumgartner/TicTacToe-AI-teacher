const { chromium } = require('playwright');
const express = require('express');
const app = express();
const path = require('path');

app.use('/TicTacToe-AI-teacher', express.static(path.join(__dirname, 'dist')));

const server = app.listen(4175, async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log('CONSOLE ERROR:', msg.text());
    }
  });
  
  page.on('pageerror', err => {
    console.log('PAGE ERROR:', err.message);
  });

  await page.goto('http://localhost:4175/TicTacToe-AI-teacher/index.html');
  await page.waitForTimeout(2000);
  
  const blocklyDivHTML = await page.$eval('#blocklyDiv', el => el.innerHTML.substring(0, 500));
  console.log('Blockly Div HTML:', blocklyDivHTML);
  
  const blocklyDivStyle = await page.$eval('#blocklyDiv', el => {
    const s = window.getComputedStyle(el);
    return `w:${s.width}, h:${s.height}, d:${s.display}`;
  });
  console.log('Blockly Div Style:', blocklyDivStyle);

  await browser.close();
  server.close();
});
