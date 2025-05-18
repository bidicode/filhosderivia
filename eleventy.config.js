import htmlMinifier from "./eleventy.html-minifier.js";
import { minifyCSS, minifyJS, updateImages } from "./eleventy.assets-minifier.js";

export const config = {
  dir: {
    input: "src",
    output: "public",
    includes: "_includes",
    layouts: "_layouts"
  }
};

export default function(config) {
  const isProduction = process.env.NODE_ENV === "production";
  if (isProduction) {
    console.log("🔧 Modo produção: habilitando otimizações...");
  } else {
    console.log("💻 Modo desenvolvimento: build mais rápido e limpo.");
  }

  if (isProduction) {
    config.addTransform("htmlMinifier", htmlMinifier);
  }
  config.setUseGitIgnore(false);
  config.addPassthroughCopy("src/assets/images");
  config.addPassthroughCopy("src/assets/fonts");
  if (!isProduction) {
    config.addPassthroughCopy("src/assets/css");
    config.addPassthroughCopy("src/assets/js");
    config.addPassthroughCopy("src/assets/images");
  }

  config.on('afterBuild', async () => {
    if (isProduction) {
      const hash = new Date().getTime().toString();
      await minifyCSS(hash);
      await minifyJS(hash);
      await updateImages('v1');
    }
  });

  config.addCollection('sections', async (collection) => {
    return collection.getFilteredByGlob('./src/sections/*.md')
  });
};