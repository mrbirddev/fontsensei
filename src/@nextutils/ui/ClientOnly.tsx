import {PropsWithChildren, useEffect, useState} from "react";
import {useIsClient} from "usehooks-ts";

const ClientOnly = (props: PropsWithChildren) => {
  const isClient = useIsClient();

  if (!isClient) {
    return false;
  }

  return props.children;
};

export default ClientOnly;
