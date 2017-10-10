import React from 'react'
import {render} from 'react-dom'
import Img from '../src/index'
import bind from '../src/bind'

class App extends React.Component {
    constructor(...props) {
        super(...props)
    }

    componentDidMount(){
        bind(this.el)
    }

    render(){
        return(
            <div id="box-1" style={{overflowY: 'scroll', height: '100%'}} ref={el=>{this.el = el}}>
                <Img
                    loadSrc="https://file.mahoooo.com/res/file/20161206151919YRIX0DQQY7TDN3WD1J7E6A649FA2804AA06EE84C7F9EBE16A6CF62@40w_1Q"
                    src="https://file.mahoooo.com/res/file/20161206151919YRIX0DQQY7TDN3WD1J7E6A649FA2804AA06EE84C7F9EBE16A6CF62@40w_80Q"/>
                <div style={{width: '200px', height: '500px', backgroundColor: 'red'}}>占位置</div>
                <Img
                    src="https://file.mahoooo.com/res/file/20161206151919YRIX0DQQY7TDN3WD1J7E6A649FA2804AA06EE84C7F9EBE16A6CF62@40w_80Q"/>
                <div style={{width: '200px', height: '500px', backgroundColor: 'red'}}>占位置</div>
                <Img
                    loadSrc="https://file.mahoooo.com/res/file/20170902515433930L5KKPL6CQRATQGBD032D51D4583B280DAABBB82CFFF637E8115D@240w_1Q"
                    src="https://file.mahoooo.com/res/file/20170902515433930L5KKPL6CQRATQGBD032D51D4583B280DAABBB82CFFF637E8115D@240w_80Q"/>
            </div>
        )
    }
}
render(<App />, document.getElementById('root'))