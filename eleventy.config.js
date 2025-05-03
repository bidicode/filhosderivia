export const config = {
  dir: {
    input: "src",
    output: "public",
    includes: "_includes",
    layouts: "_layouts"
  }
};

export default function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy("src/assets");
};