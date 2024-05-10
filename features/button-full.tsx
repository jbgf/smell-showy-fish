import classNames from "classnames";

interface IProps {
  children: React.ReactNode;
  className?: string;
  onClick?:  React.MouseEventHandler<HTMLDivElement>;
  disabled?: boolean;
}
export const ButtonFull = (props: IProps) => {
  return <div className={classNames("plasmo-w-full plasmo-flex plasmo-justify-center plasmo-gap-x-3 plasmo-border plasmo-border-light-900 plasmo-p-2 plasmo-text-sm plasmo-text-gray-600 plasmo-rounded plasmo-items-center", props.className, 
  props.disabled ? [
    "plasmo-text-gray-400",
    "plasmo-bg-gray-200",
    "plasmo-cursor-not-allowed"
  ] : [
    "plasmo-cursor-pointer"
  ],
    
  )}
    onClick={props.onClick}
  >
      {props.children}
    </div>
}