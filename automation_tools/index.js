const Client = require('ssh2-sftp-client');
const fs = require('fs');
const unzipper = require('unzipper');
const { exec } = require('child_process');
var path = require('path');


// Configuration du client SFTP
const sftpConfig = {
  host: process.env.SFTP_HOST,
  port: process.env.SFTP_PORT ? parseInt(process.env.SFTP_PORT) : 22,
  username: process.env.SFTP_USERNAME,
  password: process.env.SFTP_PASSWORD,
  tryKeyboard: process.env.SFTP_TRY_KEYBOARD === 'true',
  readyTimeout: process.env.SFTP_READY_TIMEOUT ? parseInt(process.env.SFTP_READY_TIMEOUT) : 20000
};


const sftp = new Client();

sftp.on('keyboard-interactive', (name, instructions, instructionsLang, prompts, finish) => {
  if (prompts.length === 1) {
    finish([sftpConfig.password]);
  } else {
    console.error('Unexpected number of keyboard-interactive prompts:', prompts);
  }
});

let downloadedFileName; // Variable pour stocker le nom du fichier téléchargé

sftp.connect(sftpConfig)
  .then(() => sftp.list('/xfer/navezpup/out'))
  .then(list => {
    const remoteFile = list[list.length - 1];
    downloadedFileName = remoteFile.name;

    const remoteFilePath = `/xfer/navezpup/out/${downloadedFileName}`;
    const localFilePath = `./${downloadedFileName}`;

    return sftp.fastGet(remoteFilePath, localFilePath);
  })
  .then(() => {
    const fileNameWithoutExtension = path.basename(downloadedFileName, path.extname(downloadedFileName));
    const logFolderPath = `./logs/${fileNameWithoutExtension}`;
    const csvFolderPath = `./csv/${fileNameWithoutExtension}`;
    if (!fs.existsSync(logFolderPath)) {
      fs.mkdirSync(logFolderPath, { recursive: true });
    }
    if (!fs.existsSync(csvFolderPath)) {
      fs.mkdirSync(csvFolderPath, { recursive: true });
    }

    fs.createReadStream(`./${downloadedFileName}`)
      .pipe(unzipper.Extract({ path: logFolderPath }))
      .on('close', () => {
        fs.readdir(logFolderPath, (err, files) => {
          if (err) {
            console.error(`Could not list the directory: ${err}`);
            return;
          }

          files.forEach(file => {
            if (!file.startsWith('ezp')) {
              const filePath = path.join(logFolderPath, file);
              fs.unlink(filePath, err => {
                if (err) {
                  console.error(`Error deleting file ${file}: ${err}`);
                  return;
                }
                console.log(`File ${file} was deleted`);
              });
            }
          });
          const command = `. ~/ezpaarse/bin/env && ezp bulk ${logFolderPath} ${csvFolderPath}`;
          exec(command, (error, stdout, stderr) => {
            if (error) {
              console.log(`error: ${error.message}`);
              return;
            }
            if (stderr) {
              console.log(`stderr: ${stderr}`);
              return;
            }
            console.log(`stdout: ${stdout}`);
            // TODO: Ajoutez votre code pour gérer les fichiers CSV comme indiqué précédemment
          });
        });
      });
  })
  .catch(error => {
    console.error(error);
  });




