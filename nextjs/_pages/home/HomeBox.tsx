import React from "react";
import clsx from "clsx";
import styles from "./HomeBox.module.scss";

export interface HomeBoxData {
  href: string;
  title: string;
  description: string;
  iconPathData: string;
  iconClassName: string;
}

interface HomeBoxProps {
  data: HomeBoxData;
}

export const HomeBox: React.FC<HomeBoxProps> = ({ data }) => {
  return (
    <div className={styles.Home_box_wrapper}>
      <a className={styles.PortalLinkBox_box_wrapper} href={data.href}>
        <svg
          stroke="currentColor"
          fill="currentColor"
          strokeWidth="0"
          viewBox="0 0 640 512"
          className={clsx(
            styles.PortalLinkBox_icon,
            styles[`PortalLinkBox_${data.iconClassName}`]
          )}
          height="1em"
          width="1em"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d={data.iconPathData}></path>
        </svg>
        <div className={styles.PortalLinkBox_title_wrapper}>
          <p className={styles.PortalLinkBox_title_text}>{data.title}</p>
        </div>
        <div className={styles.PortalLinkBox_description_wrapper}>
          <p>{data.description}</p>
        </div>
      </a>
    </div>
  );
};
