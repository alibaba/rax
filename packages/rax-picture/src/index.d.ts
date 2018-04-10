import * as Rax from "rax";
import {BaseProps} from "rax";
import {ImageSource} from "rax-image";

/**
 *Picture 图片
 *文档地址 https://alibaba.github.io/rax/component/picture
 */

export interface PictureProps extends BaseProps {

    /**
     * 图片来源（必需）
     *    {uri: ''}
     */
    source: ImageSource;
    /**
     * 样式，必须设置 style.width ，在已知图像真实宽高时可不设置 style.height ，让 rax-pictrue 根据的你的图像真实宽高进行计算（必需）
     */
    // style: object;

    /**
     * stretch    决定当组件尺寸和图片尺寸不成比例的时候如何调整图片的大小。
     */
    resizeMode?: string;
    /**
     * Picture 是一个 PureComponent ，它的 shouldComponentUpdate 决定了当且仅当 porps.source.uri 有变化时才会重新 render。如果你想忽略它的 shouldComponentUpdate，则传入 forceUpdate={true}
     * 默认值 false
     */
    forceUpdate?: boolean;
    /**
     *    图片真实宽度，单位 px
     */
    width: number;
    /**
     * 图片真实高度，单位 px
     */
    height: number;
    /**
     * （web端有效）根据图像是否在可视范围内延迟加载图像，Web 端需引入 framework.web.js 脚本
     * 默认false
     */
    lazyload?: boolean;
    /**
     * （web端有效）在高分辨率下使用二倍图
     * 默认值 true
     */
    autoPixelRatio?: boolean;
    /**
     * （web端有效）lazyload 时显示的背景图 URL, 不能同时设置 resizeMode，会有意想不到的效果
     */
    placeholder?: string;
    /**
     * （web端有效）图像 URL 自动删除协议头
     * 默认 true
     */
    autoRemoveScheme?: boolean;
    /**
     * （web端有效） 图像 URL 域名替换成 gw.alicdn.com
     * 默认 true
     */
    autoReplaceDomain?: boolean;
    /**
     * （web端有效） 为图像 URL 添加缩放后缀，将会根据 style 内的 width 属性添加缩放后缀
     * 默认 true
     */
    autoScaling?: boolean;
    /**
     * （web端有效） 添加 webp 后缀
     * 默认 true
     */
    autoWebp?: boolean;
    /**
     * （web端有效） 添加质量压缩后缀
     * 默认 true
     */
    autoCompress?: boolean;
    /**
     * ['q75', 'q50']    （web端有效） 图像质量压缩后缀规则
     */
    compressSuffix?: Array<string>;
    /**
     * （web端有效） 使用高质量的压缩后缀
     * 默认 true
     */
    highQuality?: boolean;
    /**
     * （web端有效） 所有针对 URL 的优化是否忽略 gif 格式的图像，默认忽略
     * 默认 true
     */
    ignoreGif?: boolean;


}


declare class Picture extends Rax.Component<PictureProps, any> {


    render(): JSX.Element;


}


export default Picture;
