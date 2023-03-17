const fs = require("fs");

const path = require("path");

function readFile(filePath) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) {
        reject(`Error in reading \n ${filePath},${err}`);
      } else {
        resolve(data);
      }
    });
  });
}
function WriteToFile(data, pathToFile) {
  return new Promise((resolve, reject) => {
    fs.writeFile(pathToFile, data, (err) => {
      if (err) {
        reject(`Error in Writing to file \n ${pathToFile},${err}`);
      } else {
        resolve(pathToFile);
      }
    });
  });
}

function appendToFile(pathToFile) {
  return new Promise((resolve, reject) => {
    fs.appendFile("fileNames.txt", pathToFile + "\n", (err) => {
      if (err) {
        reject(`Error in appending to file \n ${pathToFile} \n ${err}`);
      } else {
        resolve();
      }
    });
  });
}
function deleteFile(path) {
  return new Promise((resolve, reject) => {
    fs.unlink(path, (err) => {
      if (err) {
        reject(`Error in deleting file \n ${deleteFile} \n ${err}`);
      } else {
        resolve();
      }
    });
  });
}

function doFileOperations() {
  let datafilePath = path.join(__dirname, "lipsum.txt");
  let storingFileNames = path.join(__dirname, "fileNames.txt");
  let upperCaseFile = path.join(__dirname, "lipsumInUpperCase.txt");
  let lowerCasedInSentencedFile = path.join(__dirname, "lipsumInLowerCase.txt");
  //Read lipsum file
  readFile(datafilePath)
    .then((data) => {
      console.log("Lipsum File read successfully ");
      // Data to upper case
      let upperCasedData = data.toUpperCase();
      return WriteToFile(upperCasedData, upperCaseFile);
    })
    .then((pathToFile) => {
      console.log("Data converted to upper case successfully ");
      return appendToFile(pathToFile);
    })
    .then(() => {
      //Read Upper case file
      return readFile(upperCaseFile);
    })
    .then((upperCaseData) => {
      // Converting to lower case and sentences.
      let lowerCaseDataInSentences = upperCaseData
        .toLowerCase()
        .replace("\n", "")
        .split(".")
        .join("\n");
      return WriteToFile(lowerCaseDataInSentences, lowerCasedInSentencedFile);
    })
    .then((pathToFile) => {
      console.log(
        "Data converted to lower case and converted in to sentences successfully "
      );
      return appendToFile(pathToFile);
    })
    .then(() => {
      // Read file upperCase for sorting
      return readFile(upperCaseFile);
    })
    .then((upperCaseData) => {
      //Sort upper case file and write it to new file
      let sortedlipsumInUpperCase = upperCaseData
        .split("\n")
        .sort((line1, line2) => {
          return line1.localeCompare(line2);
        })
        .join("\n");

      return WriteToFile(
        sortedlipsumInUpperCase,
        path.join(__dirname, "sortedlipsumInUpperCaseFile.txt")
      );
    })
    .then((filePath) => {
      console.log("Uppercased data sorted successfully");
      return appendToFile(filePath);
    })
    .then(() => {
      // read lowercase file to sort
      return readFile(lowerCasedInSentencedFile);
    })
    .then((lowerCasedData) => {
      // Sort the lower case data and store it to new file
      let sortedlipsumInlowerCase = lowerCasedData
        .split("\n")
        .sort((line1, line2) => {
          return line1.localeCompare(line2);
        })
        .join("\n");
      return WriteToFile(
        sortedlipsumInlowerCase,
        path.join(__dirname, "sortedlipsumInlowerCaseFile.txt")
      );
    })
    .then((pathToFile) => {
      console.log("Lowercased data sorted successfully");
      return appendToFile(pathToFile);
    })
    .then(() => {
      //Read fileNames which are newly created
      return readFile(storingFileNames);
    })

    .then((pathNames) => {
      //Delete all the files which are newly created and store all the promises.
      const deletedPathPromises = pathNames
        .split("\n")
        .filter((pathName) => {
          return pathName !== "";
        })
        .map((pathName) => {
          return deleteFile(pathName);
        });

      return Promise.all(deletedPathPromises);
    })
    .then(() => {
      console.log("Files deleted successfully");
    })
    .catch((err) => {
      console.error(err);
    });
}

module.exports = doFileOperations;
