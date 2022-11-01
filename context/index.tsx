import { useRouter } from "next/router";
import {
  createContext,
  useContext,
  useReducer,
  ReducerState,
  Dispatch,
  ReducerAction,
} from "react";

const LanguageContext = createContext<
  [Record<string, string>, Dispatch<Action>] | null
>(null);

export const useLanguageContext = () => {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error("useLanguageContext must be used inside LanguageProvider");
  }

  return context;
};

type Action = {
  key: string;
  lng: string;
};

const languageReducer = (
  state: Record<string, string>,
  { key, lng }: Action
) => ({
  ...state,
  [key]: lng,
});

export const KEYS = {
  number: "number",
  datetime: "datetime",
};

export const LanguageProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const router = useRouter();
  const [languageSetting, changeLanguageSetting] = useReducer(languageReducer, {
    number: router.locale || "en",
    datetime: router.locale || "en",
  });

  return (
    <LanguageContext.Provider value={[languageSetting, changeLanguageSetting]}>
      {children}
    </LanguageContext.Provider>
  );
};
