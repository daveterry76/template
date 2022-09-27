import axios from "axios";
import { setCookie, getCookie, deleteCookie } from "cookies-next";
import { GetServerSidePropsContext } from "next";
import {
  UserInt,
  CachedCentreInt,
  ErrorResponseInt,
  GetRequestInt,
  PostRequestInt,
  RequestResponseInt,
} from "@src/utils/interface";

export const baseUrl = process.env.BASE_URL || process.env.NEXT_PUBLIC_BASE_URL;
export const isServerSide = typeof window === "undefined";
export const FILE_DOWNLOAD_URL =
  process.env.NEXT_PUBLIC_FILE_DOWNLOAD_URL ||
  "https://storage.contentionary.com/v1/download?fileUrl=";

export const devLog = (title: string, value: any) => {
  console.log(`\n\n\n\n================${title}\n===========`, value);
};

export const redirect = (
  destination: string,
  environment: "client" | "server" = "server"
) => {
  if (environment === "server")
    return {
      redirect: { destination },
    };

  window.location.href = destination;
};

export const isEmpty = (value: any) => {
  let isEmpty = false;
  if (!value) isEmpty = true;
  else if (typeof value === "object" && Object.keys(value).length === 0)
    isEmpty = true;

  return isEmpty;
};

export const parseJSON = (data: any) => {
  try {
    return JSON.parse(data);
  } catch (err) {
    return data;
  }
};

export const handleError = (err: any): ErrorResponseInt => {
  if (err?.name === "AxiosError") {
    const { data } = err.response;
    err.message = data?.message || "Something went wrong with your request";
    err.statusCode = data?.httpStatusCode || 500;
  }
  const statusCode = err.statusCode || 500;
  const message = err.message || "Something went wrong";
  devLog("Error handler", err);

  return { message, statusCode };
};

export const cache = {
  set: (
    key: string,
    value: any,
    context?: GetServerSidePropsContext | boolean
  ): void => {
    try {
      value = typeof value === "string" ? value : JSON.stringify(value);
      if (isServerSide) {
        setCookie(key, value, context as GetServerSidePropsContext);
      } else {
        localStorage.setItem(key, value);
        if (context) setCookie(key, value);
      }
    } catch (err) {
      handleError(err);
    }
  },

  get: (key: string, context?: GetServerSidePropsContext) => {
    try {
      let value: any;

      if (isServerSide) {
        value = getCookie(key, context);
      } else {
        value = localStorage.getItem(key);
      }
      if (isEmpty(value)) return null;

      value = parseJSON(value);

      return value;
    } catch (err) {
      handleError(err);
    }
  },

  delete: (
    key: string,
    context?: GetServerSidePropsContext | boolean
  ): void => {
    try {
      if (isServerSide) {
        deleteCookie(key, context as GetServerSidePropsContext);
      } else {
        localStorage.removeItem(key);
        if (context) deleteCookie(key);
      }
    } catch (err) {
      handleError(err);
    }
  },
};

export const request = {
  get: async ({
    url,
    method = "GET",
    token,
  }: GetRequestInt): Promise<RequestResponseInt> => {
    const authorization = token || cache.get("token");
    const headers: any = {};
    if (authorization) headers.authorization = authorization;

    url = baseUrl + url;
    const { data } = await axios({
      method,
      url,
      headers,
    });

    return data;
  },

  post: async ({
    url,
    data,
    method = "POST",
    token,
    headers,
  }: PostRequestInt): Promise<RequestResponseInt> => {
    const authorization = token || cache.get("token");

    if (authorization) headers.authorization = authorization;

    const response = await axios({
      method,
      url: baseUrl + url,
      headers,
      data,
    });

    return response.data;
  },

  delete: async (url: string) => await request.get({ url, method: "DELETE" }),
  patch: async (params: PostRequestInt) =>
    await request.post({ ...params, method: "PATCH" }),
};

export const kCount = (count: number) => {
  function parseNumberFloat(divider: number, quantity: string) {
    let kView = String(count / divider);
    let view = kView.split(".");
    let remainder = view[1]?.split("");
    let remainderToNumber = parseInt(remainder && remainder[0]);
    return (
      view[0] +
      (remainderToNumber > 0 ? `.${remainderToNumber}` : "") +
      quantity
    );
  }

  if (count >= 1000000000) {
    return parseNumberFloat(1000000000, "B");
  } else if (count >= 1000000) {
    return parseNumberFloat(1000000, "M");
  } else return parseNumberFloat(1000, "K");
};

export const pageErrorHandler = (
  err: unknown,
  user: UserInt,
  token: string,
  centre: CachedCentreInt
) => ({
  props: {
    error: handleError(err),
    cachedData: { user, centre, token },
  },
});

export const getCentre = async (
  context: GetServerSidePropsContext
): Promise<CachedCentreInt> => {
  try {
    const host = context.req.headers.host as string;
    cache.delete(host, context);
    let centre = cache.get(host, context);
    devLog("Cached centre 1", centre);
    if (centre) return centre;

    const { data } = (await request.get({
      url: `/centre/domain-centre?domain=${host}`,
    })) as RequestResponseInt;
    centre = {
      id: data.id,
      slug: data.slug,
      name: data.name,
      template: data.template,
      logo: data.logo,
    };

    devLog("Cached centre 2", centre);
    cache.set(host, centre, context);

    return centre;
  } catch (err) {
    throw err;
  }
};
