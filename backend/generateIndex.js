const fs = require("fs");
const path = require("path");

const capitalizeFirstLetter = (string) =>
  string.charAt(0).toUpperCase() + string.slice(1);

const createIndexFile = (dir, suffix, capitalize = false) => {
  const files = fs.readdirSync(dir);
  const exports = files
    .filter((file) => file !== "index.js" && file.endsWith(suffix))
    .map((file) => {
      let name = path.basename(file, suffix);
      if (capitalize) {
        name = capitalizeFirstLetter(name);
      }
      return `const ${name} = require('./${file}');`;
    })
    .join("\n");

  const exportStatements = files
    .filter((file) => file !== "index.js" && file.endsWith(suffix))
    .map((file) => {
      let name = path.basename(file, suffix);
      if (capitalize) {
        name = capitalizeFirstLetter(name);
      }
      return `    ${name},`;
    })
    .join("\n");

  const indexContent = `${exports}\n\nmodule.exports = {\n${exportStatements}\n};\n`;

  fs.writeFileSync(path.join(dir, "index.js"), indexContent);
  console.log(`Created index.js in ${dir}`);
};

const directories = {
  controllers: { suffix: ".controllers.js" },
  middlewares: { suffix: ".js" },
  models: { suffix: ".model.js", capitalize: true },
  routes: { suffix: ".routes.js" },
  utils: { suffix: ".js" },
};

for (const [dir, { suffix, capitalize }] of Object.entries(directories)) {
  const dirPath = path.join(__dirname, dir);
  if (fs.existsSync(dirPath)) {
    createIndexFile(dirPath, suffix, capitalize);
  } else {
    console.warn(`Directory ${dir} does not exist.`);
  }
}
