import {type AnyRouter} from "@trpc/server";
import {type TRPCClientError, type TRPCLink} from "@trpc/client";
import {observable, tap} from "@trpc/server/observable";
import Router from "next/router";
const onError = (result: TRPCClientError<AnyRouter>) => {
  // console.log('result', typeof result, Object.keys(result), result);
  const data = result.data as unknown; // "any" will not check types, however result.data may not exists

  if (typeof data !== "object") {
    return;
  }

  if (!data) {
    return;
  }

  if (!('code' in data)) {
    return;
  }

  if (data.code === 'UNAUTHORIZED') {

    // if (localStorage.getItem(UNION_AUTH_KEY)) {
    //   toast.error('Authentication expired, Please login again.', { autoClose: 1500, toastId: "UNAUTHORIZED" });
    // } else {
    //   // when there's no token, it's the first login, do not toast.
    // }

    // console.log(data.code);

    void Router.push('/auth/signin');
    // location.href = '/auth/signin';
    // nextRouter.push('/auth/signin');
    // console.log('authenticationClient', authenticationClient);

    // authenticationClient.logout().then(() => {
    //   Router.reload();
    // });
    return;
  }
  // console.log('result', result.data, result.message, result.name);
};

export function requestFinishLink<TRouter extends AnyRouter = AnyRouter>(): TRPCLink<TRouter> {
  return () => {
    return ({ op, next }) => {
      return observable((observer) => {
        return next(op)
          .pipe(
            tap({
              next(result) {
                // onResult(result);
              },
              error(result) {
                onError(result);
              },
            }),
          )
          .subscribe(observer);
      });
    };
  };
}
