import { useSession } from "next-auth/react";
import { useEffect } from "react";

const RefreshTokenHandler = ({ setInterval }: any) => {
  const { data: session } = useSession();

  useEffect(() => {
    if (!!session) {
      const { user } = session as any;

      const timeRemaining = Math.round(
        (user.expireIn - 5 * 60 * 1000 - Date.now()) / 1000
      );

      setInterval(timeRemaining > 0 ? timeRemaining : 0);
    }
  }, [session]);

  return null;
};

export default RefreshTokenHandler;
