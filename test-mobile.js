import { chromium } from 'playwright';
import path from 'path';

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 400, height: 800 } // Mobile viewport
  });
  const page = await context.newPage();
  
  try {
    await page.goto('http://localhost:5173/');
    
    // Check Student pill to open the longest slider
    await page.click('text="Student"');
    
    // Wait for animation
    await page.waitForTimeout(1000);
    
    // Scroll down
    await page.evaluate(() => window.scrollBy(0, 500));
    
    // Take screenshot
    await page.screenshot({ 
      path: '/Users/abdelrahmanmassriattal/.gemini/antigravity/brain/8f63701c-8575-43cb-9029-ba61315b8b7c/mobile_slider_test.png',
      fullPage: false
    });
    
    console.log("Screenshot saved!");
  } catch (e) {
    console.error("Test failed:", e);
  } finally {
    await browser.close();
  }
})();
