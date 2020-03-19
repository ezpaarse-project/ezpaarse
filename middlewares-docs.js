/* eslint-disable no-sync */
'use strict';

const winston = require('winston');
const chalk = require('chalk');
const glob = require('glob');
const path = require('path');
const fs = require('fs');

const { format } = winston;
const logger = winston.createLogger({
  level: 'info',
  format: format.combine(
    format.colorize(),
    format.timestamp(),
    format.printf(info => `${info.level}: ${info.message}`)
  ),
  transports: [new (winston.transports.Console)()]
});

const links = [];

const dir = path.resolve(__dirname, 'doc', 'middlewares');
if (!fs.existsSync(dir)) {
  logger.info(chalk.green(`Create ${dir} folder.`));
  fs.mkdirSync(dir);
}

glob('./middlewares/**/*.md',
  {
    ignore: [
      './middlewares/node_modules/**/*.md',
      './middlewares/README.md'
    ]
  }, (err, files) => {
    if (err) return logger.error(chalk.red(err));

    files.forEach((file) => {
      try {
        const normalizedPath = path.normalize(path.dirname(file));
        links.push(`/${normalizedPath}.md`);

        const middlewareName = normalizedPath.split('/')[1];
        const destination = path.resolve(
          __dirname,
          'doc',
          'middlewares',
          `${middlewareName}.md`
        );

        logger.info(chalk.green(`Copying ${middlewareName} content to ${destination}.`));
        fs.createReadStream(path.resolve(file)).pipe(fs.createWriteStream(destination));
      } catch (e) {
        logger.error(chalk.red(e));
      }
    });

    logger.info(chalk.green(`Update ${path.resolve('./doc/.vuepress/middlewares.json')} file.`));
    fs.writeFile(
      path.resolve('./doc/.vuepress/middlewares.json'),
      JSON.stringify(links, null, 2),
      'utf8',
      (err) => {
        if (err) throw new Error(err);
      });
  });