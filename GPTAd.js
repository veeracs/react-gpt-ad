import classNames from 'classnames';
import React, { Component, PropTypes } from 'react';
import * as DFPService from './helpers/service';

if (!global.__TESTING__) {
  require('./Ads.scss');
}

class GPTAd extends Component {
  constructor(props) {
    super();
    //  setup slot id
    this._id = `gpt-ad${props.path.replace(/\//g, '-')}-${Math.floor(Math.random() * 1000000)}`;
  }

  componentDidMount() {
    const { enabled, path, placement, size, outOfPage, targeting, slotRendered } = this.props;

    if (enabled) {
      //  Initialize DFP service
      DFPService.init((obj) => {
        const outOfPageElm = document.getElementsByClassName('out-of-page')[0];
        const outOfPagePos = 'fn_top_capsule';
        if (obj.pos === outOfPagePos) {
          const topLeaderboard = document.getElementsByClassName('top-leaderboard')[0];
          if (obj.rendered) {
            topLeaderboard.style.display = 'none'
            outOfPageElm.style.display = '';
            if (slotRendered) {
              slotRendered(outOfPagePos, true);
            }
          } else {
            outOfPageElm.style.display = 'none';
            slotRendered(outOfPagePos, false);
          }
        } else if (document.location.pathname !== '/') {
          outOfPageElm.style.display = 'none';
          slotRendered(outOfPagePos, false);
        }
      });

      //  action - define size mapping
      DFPService.slotActions('defineSizeMapping', {
        placement
      });


      //  action - define slot
      DFPService.slotActions('defineSlot', {
        id: this._id,
        path,
        size,
        outOfPage,
        targeting
      });

      if (self.googletag.apiReady) {
        DFPService.log('GPT API is ready, execute slot actions...', 'info', 'color: limegreen');
        DFPService.executeSlotActions();
      }
    }
  }

  render() {
    const { outOfPage, hideLabel, label} = this.props;
    const adSlotClass = classNames('dfp-ad', {
      'out-of-page': outOfPage
    });

    return this.props.enabled ?
      <div className={adSlotClass}>
        {!hideLabel &&
          <span className="dfp-ad-label">{label}</span>
        }
        <div id={this._id} />
      </div> : null;
  }
}

/**
 * propTypes
 * @property {String} placement - ad placement on the page - leaderboard, rectangle, etc.
 * @property {String} path - ad unit path
 * @property {Array} size - slot size
 * @property {Array} sizeMap -
 *    viewport - viewport size
 *    sizes - available sizes
 * @property {String} label - 'Advertisement' label
 * @property {String} hideLabel - hide 'Advertisement' label
 * @property {Boolean} singleRequest - enable single request mode
 * @property {Boolean} outOfPage - is interstitial ad unit
 * @property {Object} targeting - ad targeting
 * @property {Boolean} enabled - whether ad is enabled
 * @property {Function} slotRendered - action to register slot rendered event
 */

GPTAd.propTypes = {
  placement: PropTypes.string.isRequired,
  path: PropTypes.string.isRequired,
  size: PropTypes.array,
  sizeMap: PropTypes.arrayOf(PropTypes.shape({
    viewport: PropTypes.array,
    sizes: PropTypes.array
  })),
  label: PropTypes.string,
  hideLabel: PropTypes.bool,
  singleRequest: PropTypes.bool,
  outOfPage: PropTypes.bool,
  targeting: PropTypes.object,
  enabled: PropTypes.bool,
  slotRendered: PropTypes.func
};

GPTAd.defaultProps = {
  label: 'Advertisement',
  hideLabel: false,
  enabled: true,
  singleRequest: true,
  outOfPage: false,
  targeting: null,
};

export default GPTAd;
