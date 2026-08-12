"use client";

import { useEffect } from "react";
import { getUserSession } from "../lib/auth/session";
import { useAppDispatch } from "../lib/store/hooks";
import { hydrateAuth } from "../lib/store/slices/authSlice";

export default function AuthSessionHydrator() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(hydrateAuth(getUserSession()));
  }, [dispatch]);

  return null;
}
