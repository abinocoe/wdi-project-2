const rp         = require('request-promise');
const cheerio    = require('cheerio');
const mongoose   = require('mongoose');
const config     = require('../config/config');
const Find       = require('../models/find');
let url          = "https://finds.org.uk/database/search/results/q/pipe/thumbnail/1";
let urlend       = "/format/json";
let count        = 0;

mongoose.connect(config.db);

Find.collection.drop();

function saveThing(body, response) {
  const $    = cheerio.load(body);
  let data   = JSON.parse(body);
  const shrt = $(data.results);
  let object = {};
  shrt.each((i, result) => {
    if (shrt[i].fourFigureLat != 'undefined' && shrt[i].imagedir != 'undefined') object = {
      objectType:  shrt[i].objecttype,
      broadPeriod: shrt[i].broadperiod,
      description: shrt[i].description,
      inscription: shrt[i].inscription,
      mintName: shrt[i].mintname,
      district: shrt[i].district,
      parish: shrt[i].parish,
      lat: shrt[i].fourFigureLat,
      lng: shrt[i].fourFigureLon,
      fromDate: shrt[i].fromdate,
      todate: shrt[i].todate,
      imageURL: `https://finds.org.uk/${shrt[i].imagedir}medium/${shrt[i].filename}`,
      discoveryMethod: shrt[i].discoveryMethod,
      subsequently: shrt[i].subsequentActionTerm
    };
    Find.create(object, (err, find) => {
      if (err) return console.error(err);
      count++;
      return console.log(`${count}: ${find.objectType} was saved.`);
    });
  });
}

rp(`${url}${urlend}`)
  .then((body, response) => {
    let data = JSON.parse(body);
    const pages = ((parseInt((data.meta.totalResults)+1)/100));
    for (var j = 1; j <= pages; j++) {
      rp(`${url}/page/${j}${urlend}`)
      .then(saveThing)
      .catch(console.error);
    }
  })
  .catch(console.error);

  //let url          = "https://finds.org.uk/database/search/results/bbox/51.261915%2C-0.698833%2C51.713416%2C0.388813/show/100/thumbnail/1";
