import Cookies from 'universal-cookie';
import { CommunicationService } from "./CommunicationService";
import { AxiosError } from "axios";

export class UserService {

    private static readonly BEARER_TOKEN: string = "bearertoken";

    public static login(name: string, password: string): Promise<any> {

        const cookies = new Cookies();

        let promise = CommunicationService.getInstance().login(name, password)
        let promise2 = promise.then()

        promise.then((api: any) => {
            CommunicationService.getInstance().setBearerToken(api.data.access_token)
            cookies.set(UserService.BEARER_TOKEN, api.data.access_token, { path: '/', sameSite: true });
        }, (e: AxiosError) => {
            cookies.set(UserService.BEARER_TOKEN, '', { path: '/' });
        })
        return promise2
    }

    public static checkAuthorized(): Promise<any> {

        const cookies = new Cookies();
        let oldToken = cookies.get(UserService.BEARER_TOKEN);

        let promise = CommunicationService.getInstance().checkAuthorized(oldToken)
        let promise2 = promise.then();

        promise.then((api: any) => {
            // do nothing
        }, (e: AxiosError) => {
            cookies.set(UserService.BEARER_TOKEN, '', { path: '/', sameSite: true });
            CommunicationService.getInstance().logout() // clear token
        })
        return promise2
    };

    public static logout() {
        const cookies = new Cookies();
        cookies.set(UserService.BEARER_TOKEN, '', { path: '/', sameSite: true });
        CommunicationService.getInstance().logout();
    }
}




