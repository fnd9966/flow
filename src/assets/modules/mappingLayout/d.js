

let _tilte = { target: 't', type: 'title', text: '', textAlign: 'left', basePoint: 'e', fontSize: 70, color: "#ffffff"}
let _compass = { target: 'c', type: 'compass', basePoint: 'b', x: 40, y: 40, img: '指北针1'}
let _scale = { target: 'c', type: 'scale', basePoint: 'd', x: 40, y: 40, img: '比例尺1'}
let _legend = { target: 'c', type: 'legend', basePoint: 'c', x: 40, y: 40}
let _img = { target: 'c', type: 'img', basePoint: 'a', x: 100, y: 100, width: '', height: ''}
let _table = { target: 'c', type: 'table', basePoint: 'c', x: 40, y: 40,width:500,height:0, lineHeight: 40, table:[]}

export let _anchor = {
    title: _tilte,
    compass: _compass,
    scale: _scale,
    legend: _legend,
    img: _img,
    table: _table
}

export let layout = {
    height: '',
    width: '',
    view: [true,true,false,false],
    anchor: [
        { target: 't', type: 'title', text: '', textAlign: 'left', basePoint: 'e', fontSize: 70, color: "#ffffff"},
        { target: 'c', type: 'compass', basePoint: 'b', x: 40, y: 40, img: '指北针1'},
        { target: 'c', type: 'scale', basePoint: 'd', x: 40, y: 40, img: '比例尺1' },
        { target: 'c', type: 'legend', basePoint: 'c', x: 40, y: 40}
    ]
}

export let toolData = [
    { name: '模板', icon: 'icon_0', p: 'mb', state: false, children: [
        { name: '空白模板', type: 'click', p: 'layout', data: {
            view: [false,false,false,false],
            anchor: []
        }, state: false},
        { name: '模板1', type: 'click', p: 'layout', data: {
            view: [true,true,false,false],
            anchor: [
                { target: 't', type: 'title', text: '', textAlign: 'left', basePoint: 'e', fontSize: 70, color: "#ffffff"},
                { target: 'c', type: 'compass', basePoint: 'b', x: 40, y: 40, img: '指北针1'},
                { target: 'c', type: 'scale', basePoint: 'd', x: 40, y: 40, img: '比例尺1' },
                { target: 'c', type: 'legend', basePoint: 'c', x: 40, y: 40}
            ]
        }, state: false}
    ]},
    { name: '视图', icon: 'icon_1', p: 'st', state: false, children: [
        { name: '视图（上）', type: 'select', p: 'st_t', data: {}, state: false},
        { name: '视图（右）', type: 'select', p: 'st_r', data: {}, state: false},
        { name: '视图（下）', type: 'select', p: 'st_b', data: {}, state: false},
        { name: '视图（左）', type: 'select', p: 'st_l', data: {}, state: false}
    ]},
    { name: '插入', icon: 'icon_2', p: 'cr', state: false, children: [
        { name: '标题', type: 'select', p: 'cr_title', data: {}, state: false},
        { name: '指北针', type: 'select', p: 'cr_compass', data: {}, state: false},
        { name: '比例尺', type: 'select', p: 'cr_scale', data: {}, state: false},
        { name: '图例', type: 'select', p: 'cr_legend', data: {}, state: false}
    ]},
    { name: '图片', icon: 'icon_3', p: 'tp', state: false, data: {}},
    { name: '表格', icon: 'icon_4', p: 'bg', state: false, data: {}},
    { name: '保存', icon: 'icon_5', p: 'bc',state: false, data: {}},
    { name: '保存到模板', icon: 'icon_6', p: 'bcdmb', state: false, data: {}, width: 140}
]
