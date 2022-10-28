import { useRouter } from "next/router";
import { useEffect } from "react";
import { UrlObject } from "url";

interface Props {
  to: UrlObject | string;
}

export default function Redirect({ to }: Props) {
  const router = useRouter();

  useEffect(() => {
    router.push(to);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  return null;
}
