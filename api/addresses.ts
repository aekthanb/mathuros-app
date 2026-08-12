import { api } from "./client";
import type {
  CreateAddressInput,
  SavedAddress,
  UpdateAddressInput,
} from "../lib/address";

export const listAddressesRequest = async () => {
  const res = await api.get<SavedAddress[]>("/addresses");
  return res.data;
};

export const createAddressRequest = async (body: CreateAddressInput) => {
  const res = await api.post<SavedAddress>("/addresses", body);
  return res.data;
};

export const updateAddressRequest = async (id: string, body: UpdateAddressInput) => {
  const res = await api.patch<SavedAddress>(`/addresses/${id}`, body);
  return res.data;
};

export const deleteAddressRequest = async (id: string) => {
  await api.delete(`/addresses/${id}`);
};

export const setDefaultAddressRequest = async (id: string) => {
  const res = await api.patch<SavedAddress>(`/addresses/${id}/default`);
  return res.data;
};
