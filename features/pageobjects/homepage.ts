import { expect } from 'chai';

class HomePage {
    get checkPricesButton() {
        return $('#gtm_button_main_check_prices');
    }

    get insuranceProducts() {
        return $$('a[itemprop="url"]');
    }

    get myAccountLink() {
        return $('=My Account');
    }

    get mobileMenuButton() {
        return $('button[aria-label="Open menu"]');
    }

    async clickMyAccount() {
        await this.myAccountLink.waitForDisplayed({ timeout: 7000 });
        await this.myAccountLink.scrollIntoView();
        await this.myAccountLink.click();
    }

    async getInsuranceProducts() {
        try {
            await browser.waitUntil(
                async () => (await this.insuranceProducts.length) > 0,
                {
                    timeout: 5000,
                    timeoutMsg: 'Insurance products not loaded'
                }
            );

            const elements = this.insuranceProducts;
            const products: string[] = [];

            for (const element of elements) {
                const text = await element.getText();
                if (text) products.push(text.trim());
            }

            return products;
        } catch (err) {
            console.error('🔥 Crash in getInsuranceProducts:', err);
            return [];
        }
    }

    async open() {
        await browser.reloadSession(); // prevents BiDi stale context
        await browser.url('/');
    }

    async isButtonVisible() {
        return await this.checkPricesButton.isDisplayed();
    }

    async openMobileMenuIfNecessary() {
        const visible = await this.mobileMenuButton.isDisplayed();
        if (visible) {
            await this.mobileMenuButton.click();
            await browser.pause(500);
        }
    }

    async verifyProductLinks(expectedLinks: Record<string, { event: string; path: string }>) {
        for (const [product, { event, path }] of Object.entries(expectedLinks)) {
            // Reload homepage before each click to reset context
            await this.open();

            const selector = `a[data-event="${event}"]`;
            await this.openMobileMenuIfNecessary();

            const link = await $(selector);
            const isVisible = await link.isDisplayed();

            if (!isVisible) {
                throw new Error(`❌ ${product} link found but not visible`);
            }

            await link.scrollIntoView();
            await link.click();

            await browser.waitUntil(
                async () => (await browser.getUrl()).includes(path),
                {
                    timeout: 8000,
                    timeoutMsg: `❌ ${product} did not navigate to ${path}`
                }
            );

            const currentUrl = await browser.getUrl();
            console.log(`✅ Clicked ${product} → ${currentUrl}`);
            expect(currentUrl).to.include(path);
        }
    }
}

export default new HomePage();
