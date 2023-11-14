const { Builder, By, Key, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

(async function example() {
    const driver = await new Builder()
                                .forBrowser('chrome')
                                // .setChromeOptions(new chrome.Options().headless())
                                .build();

    try {
        await driver.get('https://www.expedia.com/');

        await rejectCookies(driver);

        await clickFlights(driver);

        const clickedLeavingFrom = await clickLeavingFrom(driver);
        if (clickedLeavingFrom) {
            await fillLeavingFromInput(driver);
        }

        const clickedGoingTo = await clickGoingTo(driver);
        if (clickedGoingTo) {
            fillGoingToInput(driver);
        }



        // Agora você pode prosseguir com as outras interações na página
        // await driver.findElement(By.name('q')).sendKeys('Selenium', Key.RETURN);
        // await driver.wait(until.titleIs('Selenium - Google Search'), 5000);
    } finally {
        // await driver.quit();
    }
})();

async function rejectCookies(driver) {
    // Espera até que o botão "Accept all" esteja presente na página
    const acceptAllButton = await driver.wait(
        until.elementLocated(By.xpath('//button[contains(., "Reject All")]')),
        5000
    );
    // Clica no botão "Accept all"
    if (acceptAllButton) {
        await acceptAllButton.click();
        console.log('Clicou no elemento com sucesso ("Reject All").');
    }
}

async function clickFlights(driver) {
    let elementToClick;

    // Tentar clicar usando XPath
    // Espera até que o elemento esteja presente na página
    elementToClick = await driver.wait(
        until.elementLocated(By.xpath("//div[@id='multi-product-search-form-1']/div/div/div/ul/li[2]/a/span")),
        5000
    );
    // Se falhar, tentar usar CSS Selector
    if (!elementToClick) {
        elementToClick = await driver.wait(
            until.elementLocated(By.css('css=.active:nth-child(2) .uitk-tab-text')),
            5000
        );
    }
    // Verificar se o texto é "Flights" antes de clicar
    elementText = await elementToClick.getText();
    if (elementText.trim() === 'Flights') {
        await elementToClick.click();
        console.log('Clicou no elemento com sucesso ("Flights").');
    } else {
        console.log('O elemento não possui o texto esperado ("Flights").');
    }
}

async function clickLeavingFrom(driver) {
    // Espera até que o elemento "Leaving from" esteja presente na página
    const leavingFromLink = await driver.wait(
        until.elementLocated(By.xpath('//button[contains(@aria-label, "Leaving from")]')),
        5000
    );

    console.log('Aguardando link "Leaving from" ficar visível...');
    await driver.wait(until.elementIsVisible(leavingFromLink), 5000);

    // Verificar se o link "Leaving from" está presente
    if (leavingFromLink) {
        // Clicar no link "Leaving from"
        await leavingFromLink.click();
        console.log('Clicou no elemento com sucesso ("Leaving from").');
        return true;

    } else {
        console.log('O elemento "Leaving from" não foi encontrado.');
        return true;
    }
}

async function clickGoingTo(driver) {
    // Espera até que o elemento "Leaving from" esteja presente na página
    console.log('Procurando o elemento ("Going to").');
    const elem = await driver.wait(
        until.elementLocated(By.xpath('//button[contains(@aria-label, "Going to")]')),
        5000
    );

    await driver.wait(until.elementIsVisible(elem), 5000);

    if (elem) {
        await elem.click();
        console.log('Clicou no elemento com sucesso ("Going to").');
        return true;

    } else {
        console.log('O elemento "Going to" não foi encontrado.');
        return true;
    }
}

async function fillLeavingFromInput(driver) {
    // Agora, espere até que o campo de entrada esteja presente na página
    console.log('Procurando o elemento ("origin_select-menu-input").');

    const inputLeavingFrom = await driver.wait(
        until.elementLocated(By.css('input[data-stid="origin_select-menu-input"]')),
        10000
    ).catch((error) => {
        console.error('Erro ao localizar o elemento "origin_select-menu-input":', error.message);
        return null;
    });

    // Verificar se o campo de entrada "Leaving from" está presente
    if (inputLeavingFrom) {
        // Espera até que o elemento "Leaving from" esteja presente na página
        let originSelectInput = await driver.wait(
            until.elementLocated(By.xpath('//input[@id="origin_select"]')),
            5000
        ).catch((error) => {
            console.error('Erro ao localizar o campo "origin_select":', error.message);
            return null; // Retorna null para indicar que o elemento não foi encontrado
        });

        // Se falhar, tentar usar CSS Selector
        if (!originSelectInput) {
            originSelectInput = await driver.wait(
                until.elementLocated(By.css('css=#origin_select')),
                5000
            ).catch((error) => {
                console.error('Erro ao localizar o campo "origin_select" usando CSS Selector:', error.message);
                return null; // Retorna null para indicar que o elemento não foi encontrado
            });
        }

        // Se encontrou
        if (originSelectInput) {
            // Enviar texto para o campo de entrada
            await inputLeavingFrom.sendKeys('OPO', Key.RETURN);
            console.log('Texto inserido no elemento ("Leaving from").');
        } else {
            console.log('O elemento de entrada "Leaving from" não foi encontrado.');
        }

    } else {
        console.log('O elemento de entrada "Leaving from" não foi encontrado.');
    }
}

async function fillGoingToInput(driver) {
    // Agora, espere até que o campo de entrada esteja presente na página
    console.log('Procurando o elemento ("destination_select-menu-input").');

    const elem = await driver.wait(
        until.elementLocated(By.css('input[data-stid="destination_select-menu-input"]')),
        10000
    ).catch((error) => {
        console.error('Erro ao localizar o elemento "destination_select-menu-input":', error.message);
        return null;
    });

    // Verificar se o campo de entrada "Leaving from" está presente
    if (elem) {
        // Espera até que o elemento "Leaving from" esteja presente na página
        let originSelectInput = await driver.wait(
            until.elementLocated(By.xpath('//input[@id="destination_select"]')),
            5000
        ).catch((error) => {
            console.error('Erro ao localizar o campo "origin_select":', error.message);
            return null; // Retorna null para indicar que o elemento não foi encontrado
        });

        // Se falhar, tentar usar CSS Selector
        if (!originSelectInput) {
            originSelectInput = await driver.wait(
                until.elementLocated(By.css('css=#destination_select')),
                5000
            ).catch((error) => {
                console.error('Erro ao localizar o campo "destination_select" usando CSS Selector:', error.message);
                return null; // Retorna null para indicar que o elemento não foi encontrado
            });
        }

        // Se encontrou
        if (originSelectInput) {
            // Enviar texto para o campo de entrada
            await elem.sendKeys('FOR', Key.RETURN);
            console.log('Texto inserido no elemento ("Going to").');
        } else {
            console.log('O elemento de entrada "Going to" não foi encontrado.');
        }

    } else {
        console.log('O elemento de entrada "Going from" não foi encontrado.');
    }
}



