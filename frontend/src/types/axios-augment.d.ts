import "axios";

declare module "axios" {
  interface AxiosRequestConfig {
    /** Khi true, client trả về full `ResponseDataSuccess` thay vì chỉ trường `data`. */
    returnEnvelope?: boolean;
  }

  interface InternalAxiosRequestConfig {
    returnEnvelope?: boolean;
  }
}
