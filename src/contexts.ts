import { type History, createMemoryHistory } from "history";
import { createContext } from "react";

export const HistoryContext = createContext<History>(createMemoryHistory());
