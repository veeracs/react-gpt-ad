'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  gpt: {
    script: 'https://www.googletagservices.com/tag/js/gpt.js',
    mapping: {
      leaderboard: {
        desktop: [[980, 400], [970, 250], [970, 90], [728, 90]],
        mobile: [[330, 400], [320, 50]]
      },
      rectangle: {
        desktop: [[980, 400], [300, 250], [300, 600], [300, 1050]],
        mobile: [[330, 400], [320, 250], [320, 50]]
      },
      instream: {
        desktop: [[980, 400], [300, 250]],
        mobile: [[330, 400], [300, 250]]
      }
    }
  }
};