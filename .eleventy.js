module.exports = function(eleventyConfig) {

    eleventyConfig.addPassthroughCopy({ "src/static": "static" });
    eleventyConfig.addPassthroughCopy({ "src/admin/config.yml": "admin/config.yml" });


    eleventyConfig.addCollection("years", function(collectionApi) {
    return collectionApi.getFilteredByGlob("src/years/*.md").reverse();
  });

  return {
    dir: {
      input: "src",
      output: "_site"
    }
  };
};
