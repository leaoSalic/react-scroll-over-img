'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.scrollOver = exports.bind = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _environment = require('./environment');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var __element = (0, _environment.get)().scrollDom,
    __offsetY = (0, _environment.get)().scrollOffset;

function Scroll() {
    var _this = this;
    this.scrollEl = false; //要监控的滚动对象
    this.preScrollEl = false; //前滚动对象
    this.handleList = [];
    this.bodyElement = 'undefined' !== typeof window ? window.document.body : { clientHeight: 0 //当前浏览器的视口高度
    };
}

Scroll.prototype.setElement = function (el) {
    var _this2 = this;

    var scrollEl = 'object' === (typeof el === 'undefined' ? 'undefined' : _typeof(el)) ? el : document.getElementById(el);
    !scrollEl && function () {
        scrollEl = _this2.bodyElement;
    }();
    this.preScrollEl = this.scrollEl;
    this.scrollEl = scrollEl;
    this.handleList.forEach(function (i) {
        return i.act && i.cb(scrollEl);
    });
};
/**
 * 判断指定元素是否进入视口（用户可视区域）
 * @param el
 * @returns {boolean}
 */
Scroll.prototype.elementInView = function (el) {
    var scrollEl = this.scrollEl,
        height = scrollEl.tagName ? scrollEl.clientHeight : scrollEl.innerHeight,
        top = el.getBoundingClientRect().top;
    return __offsetY < height - top;
};
/**
 * 设定当滚动元素变更时触发的回调函数
 * @param cb
 * @returns {Number}
 */
Scroll.prototype.addElModifyHandle = function (cb) {
    var id = this.handleList.length;
    this.handleList.push({ act: true, cb: cb });
    return id;
};
/**
 * 移除回调函数
 * @param id
 * @returns {Scroll}
 */
Scroll.prototype.removeElModifyHandle = function (id) {
    id && (this.handleList[id].act = false);
    return this;
};
/**
 * 注册滚动监听回调
 * @param cb
 */
Scroll.prototype.addListener = function (cb) {
    this.scrollEl && this.scrollEl.addEventListener('scroll', cb);
};
/**
 * 移除滚动监听回调
 * @param cb
 */
Scroll.prototype.removeListener = function (cb) {
    this.scrollEl && this.scrollEl.removeEventListener('scroll', cb);
};
/**
 * 重设滚动监听回调
 * @param cb
 */
Scroll.prototype.setListener = function (cb) {
    this.preScrollEl && this.preScrollEl.removeEventListener('scroll', cb);
    this.scrollEl && this.scrollEl.addEventListener('scroll', cb);
};

var scroll = new Scroll();
scroll.setElement(__element);
var getComponentName = function getComponentName(WrappedComponent) {
    return WrappedComponent.displayName || WrappedComponent.name || 'Component';
};

var bind = exports.bind = function bind(dom) {
    scroll.setElement(dom);
};
var _default_ = {
    renderMode: 'none',
    inOff: true,
    registerName: 'register',
    removeName: 'remove',
    emitName: 'over'
},
    setDefault = function setDefault(options) {
    if (options) {
        return Object.keys(_default_).map(function (k) {
            var v = options[k];
            return 'undefined' === typeof v ? _default_[k] : k;
        });
    } else {
        return _default_;
    }
};

/**
 * 判断当前元素是否已经滚动到屏幕内，目前只提供一次监控——当元素由下至上滚入屏幕区域时进行事件通知。
 * 需要注意的是组件只允许初始化一次，随后无法通过props修改组件的UI只能内部状态修改。
 * @param {object} opt {
 *  {string} renderMode 单个组件的重复渲染模式。[all|none]：all——任何变更都会导致重复渲染，none——不会发生重复渲染。
 *  {boolean} inOff 标记当元素滚动进入屏幕区域后，是否移除监听，默认为true
 *  {string} registerName 例如将其设定为myRegister,那么在子元素中使用props.myRegister(element)设定要监控滚入的元素。
 *  {string} removeName 移除处理器名称，默认为'remove'，调用方式props.removeScrollIn().
 *  {string} emitName 元素滚入屏幕范围的通知名称，默认为'over'，当元素滚入屏幕时，会被设置为ture,区域外为false。
 * }
 * @returns {function(*=)}
 */
var scrollOver = exports.scrollOver = function scrollOver(opt) {
    var options = setDefault(opt);
    //扩展变量
    var extParams = [].concat((0, _environment.get)().extParams),
        screen = {};
    extParams.push(options.registerName);
    extParams.push(options.removeName);
    extParams.push(options.emitName);
    screen['extParams'] = extParams;
    return function (Comp) {
        var ScrollOver = function (_React$Component) {
            _inherits(ScrollOver, _React$Component);

            function ScrollOver() {
                var _ref;

                _classCallCheck(this, ScrollOver);

                for (var _len = arguments.length, props = Array(_len), _key = 0; _key < _len; _key++) {
                    props[_key] = arguments[_key];
                }

                var _this3 = _possibleConstructorReturn(this, (_ref = ScrollOver.__proto__ || Object.getPrototypeOf(ScrollOver)).call.apply(_ref, [this].concat(props)));

                _this3.element = false; //监控的img元素
                _this3.registerHandle = _this3.registerHandle.bind(_this3);
                _this3.removeHandle = _this3.removeHandle.bind(_this3);
                _this3.elModifyHandle = _this3.elModifyHandle.bind(_this3);
                _this3.checkEmit = _this3.checkEmit.bind(_this3);
                screen[options.registerName] = _this3.registerHandle;
                screen[options.removeName] = _this3.removeHandle;
                _this3.state = { over: false };
                return _this3;
            }

            _createClass(ScrollOver, [{
                key: 'elModifyHandle',
                value: function elModifyHandle() {
                    scroll.setListener(this.checkEmit);
                }
            }, {
                key: 'registerHandle',
                value: function registerHandle(el) {
                    this.element = el;
                    this.handleId = scroll.addElModifyHandle(this.elModifyHandle);
                    scroll.addListener(this.checkEmit);
                    this.checkEmit();
                }
            }, {
                key: 'removeHandle',
                value: function removeHandle() {
                    if (this.handleId) {
                        scroll.removeElModifyHandle(this.handleId);
                        scroll.removeListener(this.checkEmit);
                    }
                }
            }, {
                key: 'checkEmit',
                value: function checkEmit() {
                    var _this4 = this;

                    scroll.elementInView(this.element) && function () {
                        options.inOff && _this4.removeHandle();
                        _this4.setState({ over: true });
                    }();
                }
            }, {
                key: 'componentWillUnmount',
                value: function componentWillUnmount() {
                    this.removeHandle();
                }
            }, {
                key: 'shouldComponentUpdate',
                value: function shouldComponentUpdate(nextProps, nextState) {
                    return 'all' === options.renderMode ? true : 'all' === (0, _environment.get)().renderMode ? true : this.state !== nextState;
                }
            }, {
                key: 'render',
                value: function render() {
                    screen[options.emitName] = this.state.over;
                    var props = Object.assign({}, this.props, screen);
                    return _react2.default.createElement(Comp, props);
                }
            }]);

            return ScrollOver;
        }(_react2.default.Component);

        ScrollOver.displayName = 'scrollOver(' + getComponentName(Comp) + ')';
        return ScrollOver;
    };
};