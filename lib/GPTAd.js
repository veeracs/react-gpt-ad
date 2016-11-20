'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _service = require('./helpers/service');

var DFPService = _interopRequireWildcard(_service);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

if (!global.__TESTING__) {
  require('./Ads.scss');
}

var GPTAd = function (_Component) {
  _inherits(GPTAd, _Component);

  function GPTAd(props) {
    _classCallCheck(this, GPTAd);

    //  setup slot id
    var _this = _possibleConstructorReturn(this, (GPTAd.__proto__ || Object.getPrototypeOf(GPTAd)).call(this));

    _this._id = 'gpt-ad' + props.path.replace(/\//g, '-') + '-' + Math.floor(Math.random() * 1000000);
    return _this;
  }

  _createClass(GPTAd, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _props = this.props,
          enabled = _props.enabled,
          path = _props.path,
          placement = _props.placement,
          size = _props.size,
          outOfPage = _props.outOfPage,
          targeting = _props.targeting,
          slotRendered = _props.slotRendered;


      if (enabled) {
        //  Initialize DFP service
        DFPService.init(function (obj) {
          var outOfPageElm = document.getElementsByClassName('out-of-page')[0];
          var outOfPagePos = 'fn_top_capsule';
          if (obj.pos === outOfPagePos) {
            var topLeaderboard = document.getElementsByClassName('top-leaderboard')[0];
            if (obj.rendered) {
              topLeaderboard.style.display = 'none';
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
          placement: placement
        });

        //  action - define slot
        DFPService.slotActions('defineSlot', {
          id: this._id,
          path: path,
          size: size,
          outOfPage: outOfPage,
          targeting: targeting
        });

        if (self.googletag.apiReady) {
          DFPService.log('GPT API is ready, execute slot actions...', 'info', 'color: limegreen');
          DFPService.executeSlotActions();
        }
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _props2 = this.props,
          outOfPage = _props2.outOfPage,
          hideLabel = _props2.hideLabel,
          label = _props2.label;

      var adSlotClass = (0, _classnames2.default)('dfp-ad', {
        'out-of-page': outOfPage
      });

      return this.props.enabled ? _react2.default.createElement(
        'div',
        { className: adSlotClass },
        !hideLabel && _react2.default.createElement(
          'span',
          { className: 'dfp-ad-label' },
          label
        ),
        _react2.default.createElement('div', { id: this._id })
      ) : null;
    }
  }]);

  return GPTAd;
}(_react.Component);

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
  placement: _react.PropTypes.string.isRequired,
  path: _react.PropTypes.string.isRequired,
  size: _react.PropTypes.array,
  sizeMap: _react.PropTypes.arrayOf(_react.PropTypes.shape({
    viewport: _react.PropTypes.array,
    sizes: _react.PropTypes.array
  })),
  label: _react.PropTypes.string,
  hideLabel: _react.PropTypes.bool,
  singleRequest: _react.PropTypes.bool,
  outOfPage: _react.PropTypes.bool,
  targeting: _react.PropTypes.object,
  enabled: _react.PropTypes.bool,
  slotRendered: _react.PropTypes.func
};

GPTAd.defaultProps = {
  label: 'Advertisement',
  hideLabel: false,
  enabled: true,
  singleRequest: true,
  outOfPage: false,
  targeting: null
};

exports.default = GPTAd;