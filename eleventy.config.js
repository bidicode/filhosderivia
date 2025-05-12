export const config = {
  dir: {
    input: "src",
    output: "public",
    includes: "_includes",
    layouts: "_layouts"
  }
};

export default function(config) {
  config.setUseGitIgnore(false);
  config.addPassthroughCopy("src/assets");

  config.addCollection('sections', async (collection) => {
    return collection.getFilteredByGlob('./src/sections/*.md')
  });
};