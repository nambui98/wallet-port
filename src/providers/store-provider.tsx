"use client"

import React from "react"
import { persistor, store } from "@store/store"
import { Provider } from "react-redux"
import { PersistGate } from "redux-persist/integration/react"

type Props = {
  children: React.ReactNode
}

const StoreProvider = ({ children }: Props) => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  )
}

export default StoreProvider
