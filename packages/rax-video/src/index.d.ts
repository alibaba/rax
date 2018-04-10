import * as Rax from "rax";
import {BaseProps} from "rax";

export interface VideoProps extends BaseProps {

    /**
     * 视频播放地址
     */
    src: string;

    /**
     * 自动播放
     */
    autoPlay?: boolean;

}

declare class Video extends Rax.Component<VideoProps, any> {

    render(): JSX.Element;
}

export default Video;
