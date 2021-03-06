'use strict';
import React from 'react'
import {get} from './environment'
import {addFilter} from './style'
import {scrollOver} from './scrollOver'
import registerFlow from './flow'

const options = get(),
    removeAttribute = (params, extParams) => {
        for (let name of extParams) {
            delete params[name]
        }
    },
    isServerEvn = () => {
        return (typeof global === 'object') && (global.global === global);
    }
/**
 * 图片滚动加载组件，当图片滚动进入浏览器的显示区域时会出发显示
 * @param onOff: 图片延迟加载的开关，默认会使用全局的onOff配置参数
 * @param loadSrc: 图片未滚入显示区域时异步加载图片地址,应该是一个很小切易于快速加载的图片，大小建议小于2KB，默认为一张空图片。
 * @param loadClassName: 图片异步加载时的样式,会和默认样式className进行样式层叠
 * @param extParams: HTML源生img标签之外的扩展属性。
 */
const Img = scrollOver()(class extends React.Component {
    constructor(...props) {
        super(...props)
        const {src, onOff, className} = this.props
        this.state = {
            className: className,
            src: onOff ? options.empty : src
        }
        this.loadedHandle = this.loadedHandle.bind(this)
    }

    componentDidMount() {//初始化加载
        const {onOff, register} = this.props
        onOff && register(this.img) //需要获取到真实的dom，用于确定其是否滚入可视区域
    }

    componentWillReceiveProps(nextProps) {
        // 渲染条件1：当图片第一次进入可视区域时
        // 渲染条件2：图片已经进入可视区域，图片发生变动
        // 渲染条件3：异步渲染关闭，但是外部修改图片链接
        if ((!this.props.over && nextProps.over && nextProps.src) ||
            (nextProps.over && nextProps.src !== this.props.src) ||
            (!this.props.onOff && nextProps.src !== this.props.src)){
            const {loadClassName, className, loadSrc} = this.props
            this.setState({
                className: `${loadClassName} ${className ? className : ''}`,
                src: loadSrc
            })
            registerFlow( nextProps.src, new Image(), this.loadedHandle)
        }
    }

    loadedHandle(result) {
        result && result.suc && this.setState({
            src: result.src,
            className: this.props.className
        })
    }

    render() {
        const params = Object.assign({}, this.props),
            {src, className} = this.state
        if (src) {
            params.src = src
        } else {
            delete params.src
        }
        params.className = className
        removeAttribute(params, params.extParams)
        return (
            <img ref={ref => {
                this.img = ref
            }} {...params}/>
        )
    }
})

Img.defaultProps = {
    loadSrc: options.empty,
    onOff: (() => {
        return (typeof global === 'object') && (global.global === global) //判断是否在服务端运行
    })() ? false : options.onOff,
    loadClassName: addFilter()
}

module.exports = Img
module.exports.default = Img