const fs = require("fs");
const path = require("path");

function deleteFile(pathToFile) {
  return new Promise((resolve, reject) => {
    fs.unlink(pathToFile, (err) => {
      if (err) {
        reject(`Error in deleting file \n ${pathToFile} \n ${err}`);
      } else {
        resolve();
      }
    });
  });
}

function createFile(pathToFile) {
  return new Promise((resolve, reject) => {
    fs.writeFile(pathToFile, "", (err) => {
      if (err) {
        reject(`Error in creating file \n ${pathToFile} \n ${err}`);
      } else {
        resolve();
      }
    });
  });
}

function readDirectory(dirPath) {
  return new Promise((resolve, reject) => {
    fs.readdir(dirPath, (err, data) => {
      if (err) {
        reject(`Error in reading Directory \n ${dirPath} \n ${err}`);
      } else {
        resolve(data);
      }
    });
  });
}

function generateRandomFileAndDelete() {
  let dirName = "randomJSON";

  let promise = new Promise((resolve, reject) => {
    //Make directory
    fs.mkdir(dirName, (err) => {
      if (err && err.code !== "EEXIST") {
        console.error("");
        reject(`ERROR in making the directory \n ${dirName} \n ${err}`);
      } else {
        resolve("Directory Created");
      }
    });
  });

  // If directory not exist or directory exist with no error continue with the process

  promise
    .then((message) => {
      console.log(message);
      //Generate arry of random numbers
      let randomNumber = Math.floor(Math.random() * (10 - 1) + 1);
      let randomCountArray = [...Array(randomNumber).keys()];
      // Generating random json file paths
      let pathsToFiles = randomCountArray.map((count) => {
        let fileName = count.toString().concat(".json");
        return path.join(dirName, fileName);
      });

      // Creating all files and collecting all promises.
      let arrayOfPromisesForCreating = pathsToFiles.map((pathToFile) => {
        return createFile(pathToFile);
      });
      return Promise.all(arrayOfPromisesForCreating);
    })
    .then(() => {
      // After creating all the files successfully. Get all the file names from the directory.
      console.log("Files created successfully");
      let dirPath = path.join(__dirname, dirName);
      return readDirectory(dirPath);
    })
    .then((FileNames) => {
      // Create paths for deleting all the files and collect all the promises in deleting files.
      let arrayOfPromisesForDeleting = FileNames.map((FileName) => {
        let pathToFile = path.join(__dirname, dirName, FileName);
        return deleteFile(pathToFile);
      });
      return Promise.all(arrayOfPromisesForDeleting);
    })
    .then(() => {
      console.log("Files deleted Successfully.");
    })
    .catch((err) => {
      console.error(err);
    });
}

module.exports = generateRandomFileAndDelete;
