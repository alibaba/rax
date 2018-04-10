import * as Rax from "rax";
import {BaseProps} from "rax";

/**
 * 图片
 * 文档地址：https://alibaba.github.io/rax/component/image
 */

export interface ImageSource {
    uri: string;
    width?: number
    height?: number
}


export interface ImageProps extends BaseProps {


    /**
     * 设置图片的 uri
     */
    source: ImageSource;


    /**
     * 决定当组件尺寸和图片尺寸不成比例的时候如何调整图片的大小
     */
    resizeMode?: string;

}

declare class Image extends Rax.Component<ImageProps, any> {

    static resizeMode: {

        //缩放图片以完全装入<image>区域，可能背景区部分空白。
        contain: 'contain',

        //缩放图片以完全覆盖<image>区域，可能图片部分看不见
        cover: 'cover',

        // 按照<image>区域的宽高比例缩放图片
        stretch: 'stretch',

        //居中
        center: 'center',

        //在横向和纵向平铺
        repeat: 'repeat',
    };


    render(): JSX.Element;
}

export default Image;
