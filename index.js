const path = require("path");
const bluebird = require("bluebird");
const fs = bluebird.promisifyAll(require("fs"));

const cfg = {
  title: "# vscode-extensions",
  root: "/Users/reyn/.vscode/extensions",
  json: "package.json",
  subs: ["displayName", "description", "publisher"],
  theme: "Themes",
  out: "./README.md"
};

let content = [];
function insert(text, lineBreak = false) {
  content.push(lineBreak ? text + "\n" : text);
}

async function walk() {
  insert(cfg.title, true);
  let dirs = await fs.readdirSync(cfg.root);
  for (let i = 0; i < dirs.length; i++) {
    let dir = dirs[i];
    let pkg = path.join(cfg.root, dir, cfg.json);
    let data = await fs.readFileSync(pkg, { encoding: "utf8" });
    try {
      let json = JSON.parse(data);
      if (!json.categories || !json.categories.includes(cfg.theme)) {
        insert(`- **${json.name}**`);
        cfg.subs.forEach(key => {
          let text = json[key] || "";
          text = text.length === 0 ? "unknown" : text;
          insert(`  - ${key}: <span style="border-bottom:2px dashed blue;">${text}</span>`);
        });
        insert("");
      }
    } catch (err) {
      console.log(dir);
    }
  }
  fs.writeFileSync(cfg.out, content.join("\n"), { encoding: "utf8" });
}

walk();
