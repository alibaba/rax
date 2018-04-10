import * as Rax from "rax";
import {BaseProps} from "rax";
import {Requireable} from "react";

/**
 * 日历
 * 文档地址：https://alibaba.github.io/rax/component/calendar
 */
export interface CalendarProps extends BaseProps {

    /**
     *    可选的起始时间
     *    yyyy-MM-dd
     */
    startDate?: string;
    /**
     * 可选的结束时间
     * yyyy-MM-dd
     */
    endDate?: string;

    /**
     * 活动日期列表
     */
    eventDates?: Array<string>;
    /**
     * 月份的渲染格式
     * 默认 MMMM YYYY
     */
    titleFormat?: string;
    /**
     * 返回的日期格式
     * 默认 YYYY-MM-DD
     */
    dateFormat?: string;
    /**
     * 把周几作为一个星期的开始
     * 默认 1
     */
    weekStart?: number;
    /**
     * 月份切换按钮的显示文案
     */
    prevButtonText?: string;
    /**
     *    月份切换按钮的显示文案
     */
    nextButtonText?: string;
    /**
     * 选中某个日期
     */
    onDateSelect?: (dateText: string) => void;
    /**
     * 上一个月
     */
    onTouchPrev?: (month: number) => void;
    /**
     * 下一个月
     */
    onTouchNext?: (month: number) => void;

}

declare class Calendar extends Rax.Component<CalendarProps, any> {
    static propTypes: {
        customStyle: Requireable<any>,
        dayHeadings: Requireable<any>,
        eventDates: Requireable<any>,
        monthNames: Requireable<any>,
        nextButtonText: Requireable<any>,
        onDateSelect: Requireable<any>,
        onSwipeNext: Requireable<any>,
        onSwipePrev: Requireable<any>,
        onTouchNext: Requireable<any>,
        onTouchPrev: Requireable<any>,
        prevButtonText: Requireable<any>,
        selectedDate: Requireable<any>,
        showControls: Requireable<any>,
        startDate: Requireable<any>,
        endDate: Requireable<any>,
        titleFormat: Requireable<any>,
        dateFormat: Requireable<any>,
        today: Requireable<any>,
        weekStart: Requireable<any>,
    };

    render(): JSX.Element;
}

export default Calendar;
