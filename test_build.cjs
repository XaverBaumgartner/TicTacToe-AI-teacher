const { chromium } = require('playwright');
const express = require('express');
const app = express();
const path = require('path');

app.use('/TicTacToe-AI-teacher', express.static(path.join(__dirname, 'dist')));

const server = app.listen(4174, async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  page.on('pageerror', error => {
    console.log('PAGE ERROR:', error.message);
    console.log('STACK:', error.stack);
  });

  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log('CONSOLE ERROR:', msg.text());
    }
  });

  await page.goto('http://localhost:4174/TicTacToe-AI-teacher/index.html');
  await page.waitForTimeout(2000);
  await browser.close();
  server.close();
});
