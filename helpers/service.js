/*
 * Internal dependencies
 */
import adsConfig from '../config';

let mapping = null;     // eslint-disable-line immutable/no-let
const adType = 'gpt';

/*
 * DFP logger
 */
export const log = (msg, type = 'log', style) => {
  if (style) {
    console[type](`%c ${msg}`, style);
    return;
  }
  console[type](msg);
};

function _displayAdSlot(id, slotDiv) {
  log('Displaying Ad slot', 'info', 'color: limegreen; background: yellow');
  self.googletag.display(id);
  self.googletag.pubads().refresh([slotDiv]);
  googletag.enableServices();
}

/*
 * Constructs an out-of-page (interstitial) ad slot with the given ad unit path
 */
function _defineOutOfPageSlot(path, id, targeting) {
  log(`Defining out-of-page Ad slot with
      network path: ${path},
      id: ${id}`, 'info', 'color: limegreen');
  log(`Ad placement: outofpage`, 'info', 'color: lightsteelblue');

  self.googletag.cmd.push(() => {
    const slotDiv = self.googletag
      .defineOutOfPageSlot(path, id)
      .addService(self.googletag.pubads())
      .setTargeting("pos", targeting.pos);

    console.log('AD Targeting...');
    console.log(targeting);
    self.googletag.pubads().setTargeting("s1", targeting.s1);
    self.googletag.pubads().setTargeting("pid", targeting.pid);
    self.googletag.pubads().setTargeting("type", targeting.type);
    self.googletag.pubads().setTargeting("test", targeting.test);
    // display the slot
    _displayAdSlot(id, slotDiv);
  });
}

/*
 * Defines a GPT ad slot
 */
const _defineSlot = (args) => {
  //  render out of page ad slot
  if (args[0].outOfPage) {
    _defineOutOfPageSlot(args[0].path, args[0].id, args[0].targeting);
  } else {
    // define size mappings, set page level targeting and call define
    log(`Defining Ad slot with
      network path: ${args[0].path},
      id: ${args[0].id}`, 'info', 'color: limegreen');
    self.googletag.cmd.push(() => {
      const slotDiv = self.googletag
        .defineSlot(
          args[0].path,
          args[0].size,
          args[0].id
        )
        .defineSizeMapping(mapping)
        .addService(self.googletag.pubads());

      self.googletag.pubads().setTargeting("pid", args[0].targeting.pid);
      _displayAdSlot(args[0].id, slotDiv);
    });
  }
};

/*
 * Defines a GPT size mapping
 */
const _defineSizeMapping = (args) => {
  const placement = args[0].placement;

  if (adsConfig[adType].mapping[placement]) {
    log(`Ad placement: ${placement}`, 'info', 'color: lightsteelblue');
    const platforms = adsConfig[adType].mapping[placement];

    self.googletag.cmd.push(() => {
      mapping = Object.keys(platforms)
        .reduce((_sizeMapping, _platform) => {
          const platformSizeMap = adsConfig[adType].mapping[placement][_platform];
          log(platformSizeMap);
          return _sizeMapping.addSize(...platformSizeMap);
        }, self.googletag.sizeMapping())
        .build();
    });
  }
};

/*
 * DFP Actions
 */
const dfpActions = {
  defineSlot: _defineSlot,
  defineSizeMapping: _defineSizeMapping
};

/*
 * DFP service
 */
export function slotActions() {
  //  Queue slot actions if DFP has not loaded, else execute them
  if (self.googletag) {
    log('Queuing DFP actions...', 'info');
    (slotActions.q = slotActions.q || []).push(arguments);// eslint-disable-line prefer-rest-params
  }
}

/*
 * Execute service map
 */
function _actionMapExecutor(map, actions) {
  if (typeof actions[0] === 'string' && typeof map[actions[0]] === 'function') {
    log(`Executing DFP action ${actions[0]}`, 'info', 'color: lightsalmon');
    map[actions.shift()](actions);
  }
}

/*
 * Dispatch DFP actions
 */
function _actionDispatcher(args) {
  _actionMapExecutor(dfpActions, [].slice.call(args, 0));
}

/*
 * Executes and reset slot actions
 */
export function executeSlotActions() {
  //  call action dispatcher
  if (slotActions.q && self.googletag) {
    slotActions.q.forEach((args) => {
      _actionDispatcher(args);
    });
    log('Empty the slot action queue', 'warn');
    slotActions.q = null;
  }
}

/*
 * Configure DFP
 */
function _dfpSettings() {
  log('Configuring DFP...', 'info', 'color: limegreen');
  self.googletag.pubads().enableSingleRequest();
  self.googletag.pubads().collapseEmptyDivs();
  self.googletag.pubads().disableInitialLoad();
  self.googletag.enableServices();

  log('Execute slot actions after script load...', 'info', 'color: limegreen');
  //  execute slot actions queued
  executeSlotActions();
}

/*
 *  Load DFP script
 */
export function loadAsset(type = 'gpt') {
  return new Promise((resolve, reject) => {
    if (self.googletag) {
      resolve(self.googletag);
    } else {
      self.googletag = self.googletag || {};
      self.googletag.cmd = self.googletag.cmd || [];
      const script = document.createElement('script');
      const head = document.getElementsByTagName('head')[0];
      script.async = true;
      script.src = adsConfig[type].script;
      script.onload = () => {
        self.googletag.cmd.push(resolve);
      };
      script.onerror = reject;
      head.appendChild(script);
    }
  });
}

/*
 *  DFP script loaded event
 */
function _onScriptLoaded() {
  log(`GPT version ${self.googletag.getVersion()} loaded!!!`, 'info', 'color: limegreen');
  self.googletag.cmd.push(_dfpSettings);
}

/*
 *  DFP script load failed event
 */
function _onScriptError() {
  log('Failed to load GPT Ad script', 'warn');
}

/*
 *  Kickoff DFP
 */
export function init(renderedCb) {
  if (!self.googletag) {
    log('Loading GPT script...', 'info', 'color: limegreen');
    loadAsset()
      .then(() => {
        //  slot rendered event
        self.googletag.pubads().addEventListener('slotRenderEnded', (event) => {
          log('Render events for Ad slots...');
          log(event);
          renderedCb({
            rendered: !event.isEmpty,
            pos: event.slot.getTargeting('pos')[0]
          });
        });
        _onScriptLoaded();
      })
      .catch(() => {
        _onScriptError();
      });
  }
}
