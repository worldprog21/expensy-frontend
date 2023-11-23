import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import axios from "axios";

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

const baseURL = process.env.NEXT_PUBLIC_BASE_URL;
export function getObject(route, objectId, hasPopulate, jwt) {
  return axios
    .get(`${baseURL}/${route}/${objectId}${hasPopulate === true ? '?populate=*' : ''}`, {
      headers: {
        'Authorization': 'Bearer ' + jwt
      }
    })
    .then((res) => res.data)
    .catch((e) => e.response?.data ?? { error: e });
}

export function getDeepObject(route, objectId, jwt) {
  return axios
    .get(`${baseURL}/${route}/${objectId}?populate=deep`, {
      headers: {
        'Authorization': 'Bearer ' + jwt
      }
    })
    .then((res) => res.data)
    .catch((e) => e.response?.data ?? { error: e });
}

export function findObject(url, jwt) {
  return axios
    .get(`${baseURL}/${url}`, {
      headers: {
        'Authorization': 'Bearer ' + jwt
      }
    })
    .then((res) => res.data)
    .catch((e) => e.response?.data ?? { error: e });
}

export function saveObject(route, object, jwt) {
  const url = `${baseURL}/${route}${object.id ? `/${object.id}` : ""}`;
  if (object.id)
    return axios
      .put(url, { data: object }, {
        headers: {
          'Authorization': 'Bearer ' + jwt
        }
      })
      .then((res) => res.data)
      .catch((e) => e.response?.data ?? { error: e });

  return axios
    .post(url, { data: object }, {
      headers: {
        'Authorization': 'Bearer ' + jwt
      }
    })
    .then((res) => res.data)
    .catch((e) => e.response?.data ?? { error: e });
}

export function deleteObject(route, jwt) {
  const url = `${baseURL}/${route}`;
  return axios
    .delete(url, {
      headers: {
        'Authorization': 'Bearer ' + jwt
      }
    })
    .catch((e) => e.response?.data ?? { error: e });
}