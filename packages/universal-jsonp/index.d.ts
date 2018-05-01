/**
 * universal-jsonp
 * 通用jsonp
 */
export interface JsonpParam {

    jsonpCallbackFunctionName: string
}

export function jsonp(url: string, param: JsonpParam): Promise<any>
