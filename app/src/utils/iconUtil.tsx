import { ImgHTMLAttributes } from "react";

type Props = ImgHTMLAttributes<HTMLImageElement>;

export const AspireIcon = (props: Props) => (
  <img alt="Aspire Icon" src="app/public/icons/Logo.svg" {...props} />
);