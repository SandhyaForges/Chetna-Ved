const fs = require("fs");
const path = require("path");

const folder = "./image/wedding/full"; // Replace with your folder path

function renameFiles() {
  const files = fs.readdirSync(folder)
    .filter(file =>
      fs.statSync(path.join(folder, file)).isFile() &&
      path.extname(file).toLowerCase() === ".webp"
    )
    .sort((a, b) =>
      a.localeCompare(b, undefined, {
        numeric: true,
        sensitivity: "base"
      })
    );

  // Step 1: Rename all files to temporary names
  files.forEach((file, index) => {
    const oldPath = path.join(folder, file);
    const tempPath = path.join(
      folder,
      `test${index + 1}.webp`
    );

    fs.renameSync(oldPath, tempPath);
  });

  console.log("Step 1 completed: Temporary renaming done.");

  // Step 2: Rename temporary files to normal numbers
  files.forEach((file, index) => {
    const tempPath = path.join(
      folder,
      `test${index + 1}.webp`
    );

    const newPath = path.join(
      folder,
      `${index + 1}.webp`
    );

    fs.renameSync(tempPath, newPath);
  });

  console.log(`Done! Renamed ${files.length} images.`);
}

try {
  renameFiles();
} catch (error) {
  console.error("Error:", error.message);
}
