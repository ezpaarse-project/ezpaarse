const fs = require('fs');
const ezmesure = require('ezmesure');
const path = require('path');
require('dotenv').config();

const token = process.env.EZMESURE_TOKEN;
const indexId = process.env.EZMESURE_INDEX_ID;

const mainFolderPath = `./csv`;

// Fonction pour trier les dossiers par date de création
const getSortedFolders = (folderPath) => {
  return fs.readdirSync(folderPath, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => ({
      name: dirent.name,
      time: fs.statSync(path.join(folderPath, dirent.name)).mtime.getTime()
    }))
    .sort((a, b) => b.time - a.time)
    .map(dirent => dirent.name);
};

const sortedFolders = getSortedFolders(mainFolderPath);
if (sortedFolders.length > 0) {
  const latestFolder = sortedFolders[0];
  const csvFolderPath = path.join(mainFolderPath, latestFolder);

  fs.readdir(csvFolderPath, (err, files) => {
    if (err) {
      console.error(`Could not list the directory: ${err}`);
      return;
    }
    files.forEach((file, index) => {
      // Vérifiez que le fichier est un .csv
      if (path.extname(file) === '.csv') {
        const filePath = path.join(csvFolderPath, file);
        const readStream = fs.createReadStream(filePath);

        ezmesure.indices.insert(readStream, indexId, { token: token })
          .then(response => {
            console.log(`File ${file} successfully sent to Ezmesure: ${response}`);
          })
          .catch(err => {
            console.error(`Error sending file ${file} to Ezmesure: ${err}`);
          });
      }
    });
  });
} else {
  console.error(`No folders found in ${mainFolderPath}`);
}