import { ReactNode } from "react";

type Props = {
  children?: ReactNode;
};

export function PostTitle({ children }: Props) {
  return (
    <h1 className="mx-auto mb-4 max-w-3xl text-3xl font-semibold md:text-4xl">
      {children}
    </h1>
  );
}
