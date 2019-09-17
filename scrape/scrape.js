const cheerio = require('cheerio');
const puppeteer = require('puppeteer-extra');
const pluginStealth = require('puppeteer-extra-plugin-stealth');
const moment = require('moment');

const setCodeJSON = {
    '10th Edition': '10E',
    '4th Edition': '4ED',
    '5th Edition': '5ED',
    '6th Edition': '6ED',
    '7th Edition': '7ED',
    '8th Edition': '8ED',
    '9th Edition': '9ED',
    'Aether Revolt': 'AER',
    'Alara Reborn': 'ARB',
    Alliances: 'ALL',
    Amonkhet: 'AKH',
    'Amonkhet Invocations': 'MPS',
    Anthologies: 'ATH',
    Antiquities: 'ATQ',
    Apocalypse: 'APC',
    'Arabian Nights': 'ARN',
    Archenemy: 'ARC',
    'Archenemy: Nicol Bolas': 'E01',
    'Arena League': 'ARENA',
    'Armada Comics': 'ARMADA',
    'Avacyn Restored': 'AVR',
    Battlebond: 'BBD',
    'Battle for Zendikar': 'BFZ',
    'Battle Royale': 'BRB',
    Beatdown: 'BTD',
    'Betrayers of Kamigawa': 'BOK',
    'Book Insert': 'BOOK',
    'Born of the Gods': 'BNG',
    'Buy-a-Box Promos': 'BABOX',
    'Champions of Kamigawa': 'CHK',
    'Champs Promos': 'CHPR',
    Chronicles: 'CHR',
    Coldsnap: 'CSP',
    'Coldsnap Theme Deck Reprints': 'TDR_CSP',
    "Collectors' Edition": 'COLLECT',
    'Commander 2011': 'CMD',
    'Commander 2013': 'C13',
    'Commander 2014': 'C14',
    'Commander 2015': 'C15',
    'Commander 2016': 'C16',
    'Commander 2017': 'C17',
    'Commander 2018': 'C18',
    'Commander 2019': 'C19',
    'Commander Anthology': 'CMA',
    'Commander Anthology Volume II': 'CM2',
    "Commander's Arsenal": 'CM1',
    Conflux: 'CON',
    Conspiracy: 'CNS',
    'Conspiracy: Take the Crown': 'CN2',
    Convention: 'CONV',
    'Core 2019': 'M19',
    'Coro Coro Comic': 'CORO',
    'Dark Ascension': 'DKA',
    Darksteel: 'DST',
    'DCI Legend Membership': 'DCILM',
    Deckmasters: 'DKM',
    Dissension: 'DIS',
    Dominaria: 'DOM',
    "Dragon's Maze": 'DGM',
    'Dragons of Tarkir': 'DTK',
    'Dragons of Tarkir Dragonfury Game': 'TDKGAME',
    'Duel Decks: Ajani vs. Nicol Bolas': 'DDH',
    'Duel Decks: Anthology': 'DD3',
    'Duel Decks: Blessed vs. Cursed': 'DDQ',
    'Duel Decks: Divine vs. Demonic': 'DDC',
    'Duel Decks: Elspeth vs. Kiora': 'DDO',
    'Duel Decks: Elspeth vs. Tezzeret': 'DDF',
    'Duel Decks: Elves vs. Goblins': 'EVG',
    'Duel Decks: Elves vs. Inventors': 'DDU',
    'Duel Decks: Garruk vs. Liliana': 'DDD',
    'Duel Decks: Heroes vs. Monsters': 'HVM',
    'Duel Decks: Izzet vs. Golgari': 'DDJ',
    'Duel Decks: Jace vs. Chandra': 'DD2',
    'Duel Decks: Jace vs. Vraska': 'DDM',
    'Duel Decks: Knights vs. Dragons': 'DDG',
    'Duel Decks: Merfolk vs. Goblins': 'DDT',
    'Duel Decks: Mind vs. Might': 'DDS',
    'Duel Decks: Nissa vs. Ob Nixilis': 'DDR',
    'Duel Decks: Phyrexia vs. The Coalition': 'DDE',
    'Duel Decks: Sorin vs. Tibalt': 'DDK',
    'Duel Decks: Speed vs. Cunning': 'DDN',
    'Duel Decks: Venser vs. Koth': 'DDI',
    'Duel Decks: Zendikar vs. Eldrazi': 'DDP',
    'Duels of the Planeswalkers': 'DPA',
    'Duels of the Planeswalkers Game Promos': 'DPWGP',
    'Eldritch Moon': 'EMN',
    'Eternal Masters': 'EMA',
    Eventide: 'EVE',
    Exodus: 'EXO',
    'Explorers of Ixalan': 'E02',
    'Fallen Empires': 'FEM',
    'Fate Reforged': 'FRF',
    'Fate Reforged Clash Pack': 'CP_FRF',
    'Fifth Dawn': '5DN',
    'FNM Promos': 'FNMP',
    'From the Vault: Angels': 'V15',
    'From the Vault: Annihilation': 'V14',
    'From the Vault: Dragons': 'DRB',
    'From the Vault: Exiled': 'V09',
    'From the Vault: Legends': 'V11',
    'From the Vault: Lore': 'V16',
    'From the Vault: Realms': 'V12',
    'From the Vault: Relics': 'V10',
    'From the Vault: Transform': 'V17',
    'From the Vault: Twenty': 'V13',
    'Future Sight': 'FUT',
    'Game Day Promos': 'GDPROM',
    'Game Night': 'GNT',
    Gatecrash: 'GTC',
    'Gift Box Promos': 'GBPROM',
    'Global Series: Jiang Yanggu & Mu Yanling': 'GS1',
    'Gotta Magazine': 'GOTTA',
    'Grand Prix Promos': 'GPPROM',
    'Guild Kit (Azorius)': 'GK_AZORIUS',
    'Guild Kit (Boros)': 'GK_BOROS',
    'Guild Kit (Dimir)': 'GK_DIMIR',
    'Guild Kit (Golgari)': 'GK_GOLGARI',
    'Guild Kit (Gruul)': 'GK_GRUUL',
    'Guild Kit (Izzet)': 'GK_IZZET',
    'Guild Kit (Orzhov)': 'GK_ORZHOV',
    'Guild Kit (Rakdos)': 'GK_RAKDOS',
    'Guild Kit (Selesnya)': 'GK_SELESNYA',
    'Guild Kit (Simic)': 'GK_SIMIC',
    Guildpact: 'GPT',
    'Guilds of Ravnica': 'GRN',
    Guru: 'GURU',
    HasCon: 'HasCon',
    Homelands: 'HML',
    'Hour of Devastation': 'HOU',
    'Ice Age': 'ICE',
    'Iconic Masters': 'IMA',
    'IDW Comics': 'IDWC',
    Innistrad: 'ISD',
    'International Edition': 'INTED',
    'Intro Packs': 'INTRO',
    Invasion: 'INV',
    Ixalan: 'XLN',
    'Journey into Nyx': 'JOU',
    'JSS/MSS Promos': 'JSSMSS',
    'Judge Promos': 'JPROM',
    Judgment: 'JUD',
    Kaladesh: 'KLD',
    'Kaladesh Inventions': 'MPS_KLD',
    'Khans of Tarkir': 'KTK',
    'Launch Promos': 'LPROM',
    'League Promos': 'LEAGUES',
    Legends: 'LEG',
    Legions: 'LGN',
    'Limited Edition Alpha': 'LEA',
    'Limited Edition Beta': 'LEB',
    Lorwyn: 'LRW',
    'Magic 2010': 'M10',
    'Magic 2011': 'M11',
    'Magic 2012': 'M12',
    'Magic 2013': 'M13',
    'Magic 2014': 'M14',
    'Magic 2015': 'M15',
    'Magic 2015 Clash Pack': 'CP_M15',
    MagicFest: 'FEST',
    'Magic Origins': 'ORI',
    'Magic Origins Clash Pack': 'CP_ORI',
    'Masters 25': 'A25',
    'Mercadian Masques': 'MMQ',
    Mirage: 'MIR',
    Mirrodin: 'MRD',
    'Mirrodin Besieged': 'MBS',
    'Mirrodin Pure Preview': 'MRDPR',
    'Miscellaneous Promos': 'MISCPROM',
    'Modern Event Deck': 'MD1',
    'Modern Masters 2013': 'MMA',
    'Modern Masters 2015': 'MM2',
    'Modern Masters 2017': 'MM3',
    Morningtide: 'MOR',
    'Mythic Edition': 'MED',
    Nationals: 'NATIONALS',
    Nemesis: 'NEM',
    'New Phyrexia': 'NPH',
    'Oath of the Gatewatch': 'OGW',
    Odyssey: 'ODY',
    'Online Store Card': 'ONLSTOR',
    Onslaught: 'ONS',
    'Open House Promos': 'OPENHOUSE',
    'Planar Chaos': 'PLC',
    'Planechase 2009': 'HOP',
    'Planechase 2012': 'PC2',
    'Planechase Anthology': 'PCA',
    Planeshift: 'PLS',
    'Player Rewards': 'PLREW',
    Portal: 'POR',
    'Portal: Second Age': 'P02',
    'Portal: Three Kingdoms': 'PTK',
    'Premium Deck Series: Fire & Lightning': 'PD2',
    'Premium Deck Series: Graveborn': 'PD3',
    'Premium Deck Series: Slivers': 'H09',
    'Prerelease Promos': 'PRPROM',
    Prophecy: 'PCY',
    'Pro Tour Promos': 'PTPROM',
    'Ravnica Allegiance': 'RNA',
    'Ravnica: City of Guilds': 'RAV',
    'Ravnica Weekend Promos': 'RAVWKND',
    'Regional PTQ Promos': 'RPTQPROM',
    'Resale Promos': 'RSLPROM',
    'Return to Ravnica': 'RTR',
    Revised: '3ED',
    'Rise of the Eldrazi': 'ROE',
    'Rivals of Ixalan': 'RIX',
    'Saviors of Kamigawa': 'SOK',
    'Scars of Mirrodin': 'SOM',
    Scourge: 'SCG',
    SDCC: 'SDCC',
    Shadowmoor: 'SHM',
    'Shadows over Innistrad': 'SOI',
    'Shards of Alara': 'ALA',
    'Showdown Promos': 'SDWNPROM',
    'Signature Spellbook: Jace': 'SS1',
    'Special Occasion': 'SPECOC',
    'Starter 1999': 'S99',
    'Starter 2000': 'S00',
    'States 2008': 'STATES08',
    'Store Championship Promos': 'STCHPROM',
    Stronghold: 'STH',
    Tempest: 'TMP',
    'The Dark': 'DRK',
    Theros: 'THS',
    'Time Spiral': 'TSP',
    'TopDeck Magazine': 'TOPDECK',
    Torment: 'TOR',
    'Two-Headed Giant': 'THGNT',
    "Ugin's Fate": 'UGINF',
    'Ultimate Masters': 'UMA',
    'Ultimate Masters: Box Toppers': 'MPS_UMA',
    Unglued: 'UGL',
    Unhinged: 'UNH',
    Unlimited: '2ED',
    Unstable: 'UST',
    "Urza's Destiny": 'UDS',
    "Urza's Legacy": 'ULG',
    "Urza's Saga": 'USG',
    Visions: 'VIS',
    'War of the Spark': 'WAR',
    Weatherlight: 'WTH',
    'Welcome Deck 2016': 'W16',
    'Welcome Deck 2017': 'W17',
    'WMCQ Promos': 'WMCQPROM',
    'World Championship': 'WCHAMP',
    Worldwake: 'WWK',
    'WPN and Gateway Promos': 'GWPROM',
    Zendikar: 'ZEN',
    'Zendikar Expeditions': 'EXP',
    'Modern Horizons': 'MH1',
    'Core 2020': 'M20',
    'MCQ Promos': 'MCQPROM',
    'Planeswalker Weekend Promos': 'PWWKND',
    'Signature Spellbook: Gideon': 'SS2',
    'Core 2019 - Promo Pack': 'M19PP',
    'Core 2020 - Promo Pack': 'M20PP',
    'Dominaria - Promo Pack': 'DOMPP',
    'Guilds of Ravnica - Promo Pack': 'GRNPP',
    'Ixalan - Promo Pack': 'XLNPP',
    'Ravnica Allegiance - Promo Pack': 'RNAPP',
    'Rivals of Ixalan - Promo Pack': 'RIXPP',
    'War of the Spark - Promo Pack': 'WARPP'
};

puppeteer.use(pluginStealth());

const BASE_URL = 'https://www.cardsphere.com';

// See http://momentjs.com/docs/#/displaying/format/ for formatting
const filenameDatetime = moment().format('MM-DD-YYYY--x');

/**
 * Returns an array of whole url's based on
 * the BASE_URL, for puppeteer to process
 * @param {array} urls
 */
function processURLs(urls) {
    return urls.map(el => BASE_URL + el);
}

/**
 * Finds all set links from a cheerio object,
 * and returns a list of complete urls
 */
function collectSetLinks($) {
    let links = [];

    $('.sets.row')
        .find('ul > li > a')
        .each((index, element) => {
            links.push($(element).attr('href'));
        });

    return processURLs(links);
}

/**
 * Launches puppeteer and scrapes sets, then navigates to each set
 * page, scraping card data and returning a list array of cards
 */
async function run() {
    console.time('scrape');
    const options = {
        headless: true,
        ignoreHTTPSErrors: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    };

    let cardList = [];

    const browser = await puppeteer.launch(options);
    const page = await browser.newPage();

    await page.goto(BASE_URL + '/sets');

    const bodyHTML = await page.evaluate(() => document.body.innerHTML);

    // This is the list of all sets:
    const $_sets = cheerio.load(bodyHTML);

    const links = collectSetLinks($_sets);

    const START = 0;

    const END = links.length;

    // Iterate over links, collecting card data:
    for (let i = START; i < END; i++) {
        await page.goto(links[i]);
        await page.waitFor(750); // Must wait for ::before and ::after pseudo elements to populate in UI

        const setName = await page.$eval('h3', el => el.innerText.trim());

        // Grabs all card rows in set page, and collects the data
        const cards = await page.evaluate(setCodeJSON => {
            const data = [];
            const rows = document.querySelectorAll('.cards ul > li');
            const setName = document.querySelector('h3').innerText.trim();
            const setCode = setCodeJSON[setName];

            rows.forEach(row => {
                const name = row.querySelector('a').innerText.trim();
                const link = row.querySelector('a').href;

                const price1 = row.querySelector('span:nth-child(2)').innerText.trim();
                const price2 = row.querySelector('span:nth-child(3)').innerText.trim();
                const setIcon = row
                    .querySelector('i')
                    .getAttribute('class')
                    .trim();

                let cardData = {
                    name: name,
                    link: link,
                    price1: price1,
                    price2: price2,
                    setIcon: setIcon,
                    setCode: setCode,
                    setName: setName,
                    isOnlyFoil: false
                };

                // Performs a check to see if only price2 has been logged (means it's only a foil print)
                if (!price1 && price2) {
                    cardData.isOnlyFoil = true;
                }

                data.push(cardData);
            });

            return data;
        }, setCodeJSON);

        // Check to make sure setCode is mapped in JSON
        cardList.forEach(card => {
            if (!card.setCode) {
                throw new Error(`Set code was not defined in JSON mapper for ${card.setName}`);
            }
        });

        // Alert the admin of scrape progress
        console.log(
            `${setName} | ${setCodeJSON[setName] ? setCodeJSON[setName] : 'NONE'} | scraped`
        );

        cardList = cardList.concat(cards);
    }

    console.log('Waiting for browser to close');
    // Apparently this hangs cloud functions. But, since the runtime is destroyed after
    // each invocation, we can just lose it for now.
    // await browser.close()
    console.timeEnd('scrape');
    return cardList;
}

module.exports.scrape = async () => {
    return await run();
};
