import { sendUnaryData, ServerUnaryCall } from 'grpc';
import { BrowserContext, Cookie } from 'playwright';
import { exists } from './playwirght-invoke';

import { Request, Response } from './generated/playwright_pb';
import { stringResponse, emptyWithLog } from './response-util';

interface CookieData {
    name: string;
    value: string;
    url?: string,
    domain?: string,
    path?: string,
    expires?: number,
    httpOnly?: boolean,
    secure?: boolean,
    sameSite?: 'Strict' | 'Lax' | 'None'
}


export async function getCookies(callback: sendUnaryData<Response.String>, context?: BrowserContext) {
    exists(context, callback, `Tried to get all cookie's, but not context open.`);
    const allCookies = await context.cookies();
    console.log(allCookies);
    const cookieName = [];
    for (const cookie of allCookies as Array<Cookie>) {
        cookieName.push(cookie.name);
    }
    callback(null, stringResponse(JSON.stringify(allCookies), cookieName.toString()));
}

export async function addCookie(
    call: ServerUnaryCall<Request.Json>,
    callback: sendUnaryData<Response.Empty>,
    context?: BrowserContext,
) {
    exists(context, callback, `Tried to add cookie, but not context open.`);
    const cookie: CookieData  = JSON.parse(call.request.getBody());
    await context.addCookies([cookie]);
    callback(null, emptyWithLog('Cookie "' + cookie.name + '" added.'));
}