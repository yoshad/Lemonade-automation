import { Given, When, Then } from '@wdio/cucumber-framework';
import HomePage from '../pageobjects/homepage';
import { expect } from 'chai';

Given('I am on the Lemonade homepage', async () => {
    await HomePage.open();
});

Then('I should see {string} button', async (buttonText: string) => {
    const isVisible = await HomePage.isButtonVisible();
    console.log('📍 Is button visible?', isVisible);
    expect(isVisible).to.be.true;

    const actualText = await HomePage.checkPricesButton.getText();
    console.log('📍 Button text found:', actualText);
    expect(actualText.toLowerCase()).to.include(buttonText.toLowerCase());
});

When('I click on the {string} link', async (linkName: string) => {
    if (linkName === 'My account') {
        await HomePage.clickMyAccount();
    } else {
        throw new Error(`❌ Link "${linkName}" not supported yet`);
    }
});

Then('I should be on the login page', async () => {
    await browser.waitUntil(
        async () => (await browser.getUrl()).includes('/login'),
        {
            timeout: 5000,
            timeoutMsg: '❌ Login page did not load in time'
        }
    );

    const currentUrl = await browser.getUrl();
    console.log('🔗 Current URL:', currentUrl);
    expect(currentUrl).to.include('/login');
});

Then('each product link should go to the correct page', async () => {
    await HomePage.verifyProductLinks({
        Renters: { event: 'menu_renters_clicked', path: '/renters' },
        Homeowners: { event: 'menu_homeowners_clicked', path: '/homeowners' },
        Car: { event: 'menu_car_clicked', path: '/car' },
        Pet: { event: 'menu_pet_clicked', path: '/pet' },
        Life: { event: 'menu_life_clicked', path: '/life' },
        Giveback: { event: 'menu_giveback_clicked', path: '/giveback' }
    });
});






// Then('I should see all insurance products', async () => {
//    const products = await HomePage.getInsuranceProducts();
//    expect(products).to.include.members([
//       'Pet',
//        'Renters',
//        'Homeowners',
//        'Car',
//        'Life'
//    ]);
//});
