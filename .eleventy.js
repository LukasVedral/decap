const fs = require("node:fs");
const path = require("node:path");
const sitemap = require("@quasibit/eleventy-plugin-sitemap");

function getSortTimestamp(entry) {
  const explicitDate = entry.data?.date ? new Date(entry.data.date).getTime() : NaN;
  if (!Number.isNaN(explicitDate)) return explicitDate;

  const inputPath = entry.inputPath || entry.data?.page?.inputPath;
  if (inputPath) {
    const absolutePath = path.join(process.cwd(), inputPath);
    if (fs.existsSync(absolutePath)) {
      return fs.statSync(absolutePath).mtimeMs;
    }
  }

  const year = Number(entry.data?.year || 0);
  if (Number.isFinite(year)) {
    return Date.UTC(year, 0, 1, 0, 0, 0);
  }

  return 0;
}

module.exports = function(eleventyConfig) {
  // Statické soubory
  eleventyConfig.addPassthroughCopy({ "src/static/uploads": "uploads" });
  eleventyConfig.addPassthroughCopy({ "src/static": "static" });
  eleventyConfig.addPassthroughCopy({ "src/admin/config.yml": "admin/config.yml" });

  // Kolekce
  eleventyConfig.addCollection("years", collectionApi => {
    return collectionApi
      .getFilteredByGlob("src/years/*.md")
      .sort((a, b) => getSortTimestamp(b) - getSortTimestamp(a));
  });

  // Filtr na URL
  eleventyConfig.addFilter("url", (value) => {
    if (!/^https?:\/\//i.test(value)) {
      return "https://" + value;
    }
    return value;
  });

  // Filtr na YouTube embed
  eleventyConfig.addFilter("youtubeEmbed", (url) => {
    const match = url.match(/v=([a-zA-Z0-9_-]+)/);
    if (match) return `https://www.youtube.com/embed/${match[1]}`;
    return url;
  });

  // Sitemap plugin
  eleventyConfig.addPlugin(sitemap, {
    sitemap: {
      hostname: "https://harcovskybloudil.cz"
    }
  });

  return {
    dir: {
      input: "src",
      output: "_site"
    }
  };
};