module.exports = function(eleventyConfig) {

    eleventyConfig.addPassthroughCopy({ "src/static": "static" });
    eleventyConfig.addPassthroughCopy({ "src/admin/config.yml": "admin/config.yml" });


  eleventyConfig.addCollection("news", function(collectionApi) {
    return collectionApi.getFilteredByGlob("src/news/*.md").reverse();
  });

    eleventyConfig.addCollection("about", function(collectionApi) {
    return collectionApi.getFilteredByGlob("src/about/*.md").reverse();
  });

    /* show datetime */
    const { DateTime } = require("luxon");

    eleventyConfig.addFilter("readableDate", dateObj => {
    return DateTime.fromJSDate(dateObj).toFormat("dd. MMMM yyyy");
    });


  return {
    dir: {
      input: "src",
      output: "_site"
    }
  };
};
