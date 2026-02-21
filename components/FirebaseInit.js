"use client";

import { useEffect } from "react";
import { firebaseApp, hasFirebaseConfig } from "../lib/firebase";

export default function FirebaseInit() {
  useEffect(() => {
    if (!hasFirebaseConfig || !firebaseApp) {
      return;
    }
  }, []);

  return null;
}
