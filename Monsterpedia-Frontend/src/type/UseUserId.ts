
import { useContext } from "react";
import { useParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export const useUserId = () => {
  const { userId: ctxUserId, logout } = useContext(AuthContext); // dal AuthContext recupero token userId (salvato con il nome ctxUserId) e logout
  const { userId: paramUserId } = useParams<{ userId: string }>(); // recupero lo userId dal parametro variabile ":userId" dell'URL salvandolo come paramUserId
  const uid = paramUserId ?? ctxUserId?.toString(); // dichiaro che uid ha come valore lo userId ricavato dal parametro ma se esso e undefine o null invece ha come valore allo userId ricavato dal contesto

  return { uid, logout };
};
