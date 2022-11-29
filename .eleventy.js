const rssPlugin = require('@11ty/eleventy-plugin-rss');

// Filters
const dateFilter = require('./src/filters/date-filter.js');
const w3DateFilter = require('./src/filters/w3-date-filter.js');

const sortByDisplayOrder = require('./src/utils/sort-by-display-order.js');

module.exports = config => {
  // Add filters
config.addFilter('dateFilter', dateFilter);
config.addFilter('w3DateFilter', w3DateFilter);
  // Returns work items, sorted by display order
config.addCollection('work', collection => {
  return sortByDisplayOrder(collection.getFilteredByGlob('./src/work/*.md'));
});

// Plugins
config.addPlugin(rssPlugin);

// Returns work items, sorted by display order then filtered by featured
config.addCollection('featuredWork', collection => {
  return sortByDisplayOrder(collection.getFilteredByGlob('./src/work/*.md')).filter(
    x => x.data.featured
  );
});

config.addCollection('blog', collection => {
  return [...collection.getFilteredByGlob('./src/posts/*.md')].reverse();
});

// Returns a list of people ordered by filename
config.addCollection('people', collection => {
  return collection.getFilteredByGlob('./src/people/*.md').sort((a, b) => {
    return Number(a.fileSlug) > Number(b.fileSlug) ? 1 : -1;
  });
});

// Set directories to pass through to the dist folder
config.addPassthroughCopy('./src/images/');
  return {
    markdownTemplateEngine: 'njk',
    dataTemplateEngine: 'njk',
    htmlTemplateEngine: 'njk',
    dir: {
      input: 'src',
      output: 'dist'
    }
  };
};