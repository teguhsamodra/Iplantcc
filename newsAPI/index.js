import express from 'express';
import cheerio from 'cheerio';
import fetch from 'node-fetch';
import axios from 'axios';
import moment from 'moment-timezone';

//setup
const PORT = process.env.PORT || 8080;
const apps = express();

apps.enable('trust proxy', 1);
apps.set('json spaces', 2);

apps.get('/', (req, res) => {
  res.send('OK');
});

apps.get('/news', async (req, res) => {
  try {
    const data = await fetch('https://hortikultura.pertanian.go.id').then(response => response.text());
    const $ = cheerio.load(data);
    const resultUrl = $('div.jeg_main > .jeg_container > .jeg_content > .jeg_vc_content').find('.jeg_slide_item').get().map((element) => $(element).find('.jeg_slide_image > a').attr('href'));
    const result = new Array();
    for (let url of resultUrl) {
      const obj = new Object();
      const response = await axios.get(url);
      const _ = cheerio.load(response.data);
      obj.title = _('meta[property=og:title]').attr('content');
      obj.sub_info = _('meta[property=og:description]').attr('content');
      obj.published = moment(_('meta[property=article:published_time]').attr('content')).format('LLL');
      obj.thumbnail = _('meta[property=og:image]').attr('content');
      obj.article = _('div.content-inner').text().trim();
      result.push(obj);
    }
    res.json(result);
  } catch (error) {
    throw error;
  }
});

apps.listen(PORT, function() {
  console.log('success connected in port:', PORT);
});