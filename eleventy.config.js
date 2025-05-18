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
  config.addTransform("htmlMinifier", htmlMinifier);
  config.setUseGitIgnore(false);
  config.addPassthroughCopy("src/assets/images");
  config.addPassthroughCopy("src/assets/fonts");

  config.on('afterBuild', async () => {
    const hash = new Date().getTime().toString();
    await minifyCSS(hash);
    await minifyJS(hash);
    await updateImages(hash);
  });

  config.addCollection('sections', async (collection) => {
    return collection.getFilteredByGlob('./src/sections/*.md')
  });
};