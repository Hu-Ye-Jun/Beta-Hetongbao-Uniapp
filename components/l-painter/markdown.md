## 介绍

开发原生小程序的时候使用过一个canvas生成图片的工具[Painter](https://github.com/Kujiale-Mobile/Painter)，支持使用json格式配置生成各种定制化图片和二维码，但是作者只发布了微信小程序原生的版本。最近在使用uniapp开发，就把插件改造了一下，在uniapp中正常运行，目前测试了web，小程序，app。

### 图一，小程序运行

![小程序图片](https://dxq-1258332952.cos.ap-guangzhou.myqcloud.com/images/5f750701-5650-4187-9fad-15b6b406e559.png "小程序图片")

### 图二，web运行
![web图片](https://dxq-1258332952.cos.ap-guangzhou.myqcloud.com/images/c333d945-5f3a-4b47-9338-c9964be8e8a8.png "web图片")
## 使用方法

## 组件文档

| 属性              | 类型               | 说明                                                                                         | 必填 | 默认值 |
| ----------------- | ------------------ | -------------------------------------------------------------------------------------------- | ---- | ------ |
| customStyle       | string             | canvas 的自定义样式                                                                          | 否   |        |
| palette           | IPalette           | 静态模版，具体规范下文有详细介绍                                                             | 否   |        |
| scaleRatio        | number             | 缩放比，会在传入的 palette 中统一乘以该缩放比，作用和 widthPixels 类似，所以不要同时使用                                               | 否   | 1      |
| widthPixels       | number             | 生成的图片的像素宽度，如不传则根据模版动态生成                                               | 否   |       |
| dirty             | boolean            | 是否启用脏检查                                                                               | 否   | false  |
| LRU               | boolean            | 是否开启 LRU 机制                                                                            | 否   | false   |
| dancePalette      | IPalette           | 动态模版，规范同静态模版                                                                     | 否   |        |
| customActionStyle | ICustomActionStyle | 选择框、缩放图标、删除图标的自定义样式与图片                                                 | 否   |        |
| action            | IView              | 动态编辑内容，用于刷新动态模版                                                               | 否   |        |
| disableAction     | boolean            | 禁止动态编辑操作                                                                             | 否   | false  |
| clearActionBox    | boolean            | 清除动态编辑框                                                                               | 否   | false  |
| imgErr            | function           | 图片生成失败，可以从 e.detail.error 获取错误信息                                             | 否   |        |
| imgOk             | function           | 图片生成成功，可以从 e.detail.path 获取生成的图片路径                                        | 否   |        |
| viewUpdate        | function           | 动态模版， view 被更新，可从 e.detail.view 获取更新的 view                                   | 否   |        |
| viewClicked       | function           | 动态模版， view 被选中， 可从 e.detail.view 获取点击的 view，如为空，则是选中背景            | 否   |        |
| touchEnd          | function           | 动态模版，触碰结束。只有 view，代表触碰的对象；包含 view、type、index，代表点击了删除 icon； | 否   |
| didShow           | function           | 动态模版，绘制结束时触发                                                                     | 否   |        |
| use2D             | boolean            | 是否使用 canvas2d 接口（注意！使用 use2D 就无法使用 dancePalette 与 action）                 | 否   | false  |

## 使用方法
和[Painter](https://github.com/Kujiale-Mobile/Painter)项目一致，只是painter组件改为l-painter，开发者开发过Painter可以无缝使用

如下：

```html
<l-painter :palette="template" @imgOK="onImgOK" />
```

```js
onShow(){
	this.template = {
        width: '320rpx',
        height: '320rpx',
        views: [
             {
                type: 'qrcode',
                content: `https://api.v2.dxq178.com/?supplier_id=${this.supplier_id}`,
                css: {
                       top: '0rpx',
                       left: '0rpx',
                       width: '320rpx',
                       height: '320rpx'
                     }
              }
             ]
    }

}

methods:{
	onImgOK(e){
		console.log(e)
	}

}


```